'use client';
import Image from 'next/image';
import { useState } from 'react';
import { PiEyeSlash } from 'react-icons/pi';
import MessageActions from '@/app/entities/atelier/MessageActions';
import ReactionBar from '@/app/entities/atelier/ReactionBar';
import ThreadPanel from '@/app/entities/atelier/ThreadPanel';
import { AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';

interface MessageBubbleProps {
  message: AtelierMessage;
  isMine: boolean;
  isAdmin: boolean;
  currentFingerprint: string | null;
  currentGithubId: string | null;
  onReact: (messageId: string, emoji: AtelierEmoji) => void;
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
  currentFingerprint,
  currentGithubId,
  onReact,
  onDelete,
  onTogglePublic,
  onBlock,
  onReplySent,
}: MessageBubbleProps) => {
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const handleMouseEnter = () => setIsActionsVisible(true);
  const handleMouseLeave = () => setIsActionsVisible(false);

  const handleReact = (emoji: AtelierEmoji) => {
    onReact(message._id, emoji);
  };

  const handleReply = () => {
    setIsThreadOpen(true);
  };

  const handleDelete = () => {
    onDelete(message._id);
  };

  const handleTogglePublic = () => {
    onTogglePublic(message._id, !message.isPublic);
  };

  const handleBlock = () => {
    if (message.author.fingerprint) {
      onBlock(message.author.fingerprint);
    }
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
  const animCls = isMine ? 'animate-bubbleInRight' : 'animate-bubbleInLeft';

  // 버블 자체 스타일 — 소유자 여부에 따라 색을 분리
  const bubbleCls = isOwner
    ? 'rounded-2xl rounded-tr-sm bg-brand-primary/80 backdrop-blur-sm text-white shadow-md'
    : 'rounded-2xl rounded-tl-sm bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-foreground border border-border shadow-sm';

  return (
    <div className={`flex flex-col gap-1 ${alignCls} ${animCls}`}>
      {/* 작성자 정보 (내 메시지가 아닐 때 상단 노출) */}
      {!isMine && (
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
          className={`${bubbleCls} px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words`}
        >
          {message.isDeleted ? (
            <span className="italic text-weak">[삭제된 메시지]</span>
          ) : (
            message.content
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
              onReact={handleReact}
              onReply={handleReply}
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

      <span className="text-xs text-weak px-1">
        {formatTime(message.createdAt)}
      </span>

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
    </div>
  );
};

export default MessageBubble;
