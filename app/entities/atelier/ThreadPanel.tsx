'use client';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MessageInput from '@/app/entities/atelier/MessageInput';
import NicknameGate from '@/app/entities/atelier/NicknameGate';
import useAtelierAuthor from '@/app/hooks/atelier/useAtelierAuthor';
import useToast from '@/app/hooks/useToast';
import {
  AtelierMessage,
  GetThreadResponse,
  PostMessageResponse,
} from '@/app/types/Atelier';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface ThreadPanelProps {
  parentId: string;
  isAdmin: boolean;
  currentFingerprint: string | null;
  currentGithubId: string | null;
  onClose: () => void;
  onReplySent: () => void;
}

// 인라인으로 펼쳐지는 스레드 패널 — 열릴 때 한 번에 모든 답글 로드
const ThreadPanel = ({
  parentId,
  isAdmin,
  currentFingerprint,
  currentGithubId,
  onClose,
  onReplySent,
}: ThreadPanelProps) => {
  const [replies, setReplies] = useState<AtelierMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const toast = useToast();
  const author = useAtelierAuthor();

  useEffect(() => {
    const fetchThread = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<GetThreadResponse>(
          `/api/atelier/messages/${parentId}/thread`
        );
        setReplies(data.replies);
      } catch {
        toast.error('답글을 불러오지 못했어요');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, [parentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (content: string) => {
    if (author.needsNickname) {
      setIsGateOpen(true);
      return false;
    }
    try {
      const { data } = await axios.post<PostMessageResponse>(
        '/api/atelier/messages',
        {
          content,
          parentId,
          nickname: author.nickname ?? undefined,
        },
        {
          headers: currentFingerprint
            ? { 'X-Fingerprint': currentFingerprint }
            : undefined,
        }
      );
      setReplies((prev) => [...prev, data.message]);
      onReplySent();
    } catch {
      toast.error('답글 전송에 실패했어요');
    }
  };

  const handleSubmitNickname = (nickname: string) => {
    author.setNickname(nickname);
    setIsGateOpen(false);
    toast.success(`${nickname}님, 환영해요!`);
  };

  const handleClose = () => {
    onClose();
  };

  const computeIsMine = (reply: AtelierMessage): boolean => {
    if (isAdmin && reply.role === 'owner') return true;
    if (currentGithubId && reply.author.githubId === currentGithubId) return true;
    if (currentFingerprint && reply.author.fingerprint === currentFingerprint)
      return true;
    return false;
  };

  return (
    <div className="ml-4 mt-1 w-[90%] rounded-xl border border-border bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur-sm p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-weak">답글</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-xs text-weak hover:text-brand-primary"
        >
          닫기
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[
            { mine: false, w: 'w-24' },
            { mine: true,  w: 'w-32' },
            { mine: false, w: 'w-20' },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col gap-0.5 ${item.mine ? 'items-end' : 'items-start'}`}>
              {!item.mine && (
                <div className="flex items-center gap-1 ml-0.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                  <div className="w-10 h-2 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                </div>
              )}
              <div className={`h-7 ${item.w} rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse`} />
            </div>
          ))}
        </div>
      ) : replies.length === 0 ? (
        <p className="text-xs text-weak">아직 답글이 없어요</p>
      ) : (
        <div className="flex flex-col gap-2">
          {replies.map((reply) => {
            const isMine = computeIsMine(reply);
            const avatar = reply.author.avatarUrl;
            return (
              <div
                key={reply._id}
                className={`flex flex-col gap-0.5 ${
                  isMine ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {!isMine && avatar && (
                    <Image
                      src={avatar}
                      alt={reply.author.nickname}
                      width={16}
                      height={16}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <span className="text-[10px] text-weak">
                    {reply.author.nickname}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-1.5 text-xs break-words ${
                    reply.role === 'owner'
                      ? 'bg-brand-primary/80 text-white'
                      : 'bg-white/80 dark:bg-neutral-800/80 border border-border text-foreground'
                  }`}
                >
                  {reply.isDeleted ? (
                    <span className="italic text-weak">[삭제된 메시지]</span>
                  ) : (
                    <MarkdownPreview
                      source={reply.content}
                      style={{ background: 'transparent', color: 'inherit', fontSize: 'inherit' }}
                      wrapperElement={{ 'data-color-mode': reply.role === 'owner' ? 'dark' : 'light' }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MessageInput
        onSend={handleSend}
        placeholder="답글을 남겨주세요... (Enter)"
        isAdmin={isAdmin}
      />

      {isGateOpen &&
        createPortal(
          <NicknameGate
            onSubmit={handleSubmitNickname}
            onClose={() => setIsGateOpen(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default ThreadPanel;
