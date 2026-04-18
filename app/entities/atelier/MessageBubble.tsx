'use client';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PiEyeSlash } from 'react-icons/pi';
import MessageActions from '@/app/entities/atelier/MessageActions';
import ReactionBar from '@/app/entities/atelier/ReactionBar';
import ThreadPanel from '@/app/entities/atelier/ThreadPanel';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import { AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';
import MarkdownPreview from '@uiw/react-markdown-preview';

// optimistic → real 교체 시 재마운트되는 컴포넌트가 입장 애니메이션을 건너뛰도록
export const skipEntryAnimSet = new Set<string>();

interface MessageBubbleProps {
  message: AtelierMessage;
  isMine: boolean;
  isAdmin: boolean;
  showAuthor: boolean;
  showTime: boolean;
  currentFingerprint: string | null;
  currentGithubId: string | null;
  onReact: (messageId: string, emoji: AtelierEmoji) => void;
  onEdit: (messageId: string, content: string) => Promise<boolean>;
  onDelete: (messageId: string) => void;
  onTogglePublic: (messageId: string, isPublic: boolean) => void;
  onBlock: (fingerprint: string) => void;
  onReplySent: (parentId: string) => void;
}

// 시간 표시 헬퍼
const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffMs < 60 * 1000) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return new Intl.DateTimeFormat('ko', {
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const MessageBubble = ({
  message,
  isMine,
  isAdmin,
  showAuthor,
  showTime,
  currentFingerprint,
  currentGithubId,
  onReact,
  onEdit,
  onDelete,
  onTogglePublic,
  onBlock,
  onReplySent,
}: MessageBubbleProps) => {
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [entered, setEntered] = useState(() => skipEntryAnimSet.has(message._id));
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleMouseEnter = () => setIsActionsVisible(true);
  const handleMouseLeave = () => setIsActionsVisible(false);

  const handleReact = (emoji: AtelierEmoji) => {
    onReact(message._id, emoji);
  };

  const handleReply = () => {
    setIsThreadOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    setIsRemoving(true);
  };

  const handleTogglePublic = () => {
    onTogglePublic(message._id, !message.isPublic);
  };

  const handleBlock = () => {
    if (message.author.fingerprint) {
      onBlock(message.author.fingerprint);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const success = await onEdit(message._id, editContent);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleToggleThread = () => {
    setIsThreadOpen((prev) => !prev);
  };

  const handleReactionToggle = (emoji: AtelierEmoji) => {
    onReact(message._id, emoji);
  };

  const isOwner = message.role === 'owner';
  const nickname = message.author.nickname || '익명';
  const avatar = message.author.avatarUrl;

  // 버블 정렬 방향
  const alignCls = isMine ? 'items-end' : 'items-start';
  const entryAnimCls = entered ? '' : (isMine ? 'animate-bubbleInRight' : 'animate-bubbleInLeft');

  // 버블 자체 스타일 — 소유자 여부에 따라 색을 분리
  const bubbleCls = isOwner
    ? 'rounded-2xl rounded-tr-sm bg-brand-primary/80 dark:bg-primary-rich backdrop-blur-sm text-white shadow-md'
    : 'rounded-2xl rounded-tl-sm bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-foreground border border-border shadow-sm';

  return (
    <div
      className={`flex flex-col gap-1 ${alignCls} ${isRemoving ? `animate-bubblePop pointer-events-none ${isMine ? 'origin-right' : 'origin-left'}` : entryAnimCls} ${showAuthor ? 'mt-4 first:mt-0' : 'mt-1'}`}
      onAnimationEnd={(e) => {
        if (isRemoving) { onDelete(message._id); return; }
        if (e.currentTarget === e.target) setEntered(true);
      }}
    >
      {/* 작성자 정보 (내 메시지가 아니고 묶음 첫 메시지일 때 노출) */}
      {!isMine && showAuthor && (
        <div className="flex items-center gap-1.5 px-1 ml-1">
          {avatar ? (
            <Image
              src={avatar}
              alt={nickname}
              width={18}
              height={18}
              className="rounded-full"
              unoptimized
            />
          ) : null}
          <span className="text-xs text-weak">{nickname}</span>
          {isOwner && (
            <span className="text-[10px] text-brand-primary border border-brand-primary/40 rounded-full px-1">
              주인
            </span>
          )}
        </div>
      )}

      {/* 버블 + 비공개 아이콘 + 호버 액션 */}
      <div
        className="max-w-[75%] relative group pt-8 -mt-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isAdmin && !message.isPublic && (
          <PiEyeSlash
            className={`absolute top-1/2 translate-y-1/2 text-weak ${isMine ? '-left-5' : '-right-5'}`}
            size={14}
            title="비공개"
          />
        )}
        <div
          className={`${bubbleCls} px-4 py-2.5 text-sm leading-relaxed break-words`}
        >
          {message.isDeleted ? (
            <span className="italic text-weak">[삭제된 메시지]</span>
          ) : isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[80px] p-2 rounded bg-white/80 dark:bg-neutral-700/80 text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs px-3 py-1 rounded border border-border hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="text-xs px-3 py-1 rounded bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <MarkdownPreview
              source={message.content}
              style={{
                background: 'transparent',
                color: 'inherit',
                fontSize: 'inherit',
              }}
              wrapperElement={{ 'data-color-mode': isOwner ? 'dark' : 'light' }}
            />
          )}
        </div>

        {/* 액션 바 — 삭제된 메시지에는 노출하지 않음 */}
        {!message.isDeleted && isActionsVisible && (
          <div
            className={`absolute top-1 ${isMine ? 'right-0' : 'left-0'} z-10`}
          >
            <MessageActions
              message={message}
              isAdmin={isAdmin}
              isMine={isMine}
              onReact={handleReact}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              onBlock={handleBlock}
            />
          </div>
        )}
      </div>

      {/* 반응 칩 */}
      {!message.isDeleted && (
        <ReactionBar
          reactions={message.reactions}
          onToggle={handleReactionToggle}
        />
      )}

      {/* 답글 개수 버튼 */}
      {message.threadCount > 0 && (
        <button
          type="button"
          onClick={handleToggleThread}
          className="text-xs text-brand-primary hover:underline px-1"
        >
          답글 {message.threadCount}개 {isThreadOpen ? '숨기기' : '보기'}
        </button>
      )}

      {(showTime || message.isEdited) && (
        <span className="text-xs text-weak px-1">
          {showTime && formatTime(message.createdAt)}
          {message.isEdited && (
            <span className="text-[10px] text-weak italic ml-1">(수정됨)</span>
          )}
        </span>
      )}

      {/* 스레드 패널 (인라인 확장) */}
      {isThreadOpen && (
        <ThreadPanel
          parentId={message._id}
          isAdmin={isAdmin}
          currentFingerprint={currentFingerprint}
          currentGithubId={currentGithubId}
          onClose={() => setIsThreadOpen(false)}
          onReplySent={() => onReplySent(message._id)}
        />
      )}

      {isDeleteModalOpen &&
        createPortal(
          <DeleteModal
            message="메시지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default MessageBubble;
