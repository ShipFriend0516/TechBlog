'use client';
import { useEffect, useRef } from 'react';
import ChatFeedSkeleton from '@/app/entities/atelier/ChatFeedSkeleton';
import MessageBubble from '@/app/entities/atelier/MessageBubble';
import { AtelierEmoji, AtelierMessage } from '@/app/types/Atelier';

interface ChatFeedProps {
  messages: AtelierMessage[];
  isAdmin: boolean;
  currentFingerprint: string | null;
  currentGithubId: string | null;
  hasMore: boolean;
  isLoadingOlder: boolean;
  isInitialLoading: boolean;
  onLoadOlder: () => Promise<void>;
  onReact: (messageId: string, emoji: AtelierEmoji) => void;
  onEdit: (messageId: string, content: string) => Promise<boolean>;
  onDelete: (messageId: string) => void;
  onTogglePublic: (messageId: string, isPublic: boolean) => void;
  onBlock: (fingerprint: string) => void;
  onReplySent: (parentId: string) => void;
}

// 현재 방문자 기준으로 "내 메시지" 여부 판단
const computeIsMine = (
  message: AtelierMessage,
  isAdmin: boolean,
  fingerprint: string | null,
  githubId: string | null
): boolean => {
  if (isAdmin && message.role === 'owner') return true;
  if (githubId && message.author.githubId === githubId) return true;
  if (fingerprint && message.author.fingerprint === fingerprint) return true;
  return false;
};

// 같은 작성자인지 판단
const isSameAuthor = (a: AtelierMessage, b: AtelierMessage): boolean => {
  if (a.role !== b.role) return false;
  if (a.author.githubId && b.author.githubId)
    return a.author.githubId === b.author.githubId;
  if (a.author.fingerprint && b.author.fingerprint)
    return a.author.fingerprint === b.author.fingerprint;
  return a.author.nickname === b.author.nickname && a.role === b.role;
};

// 1분 이내 연속 메시지인지 판단
const isWithinOneMinute = (a: AtelierMessage, b: AtelierMessage): boolean => {
  const diff = Math.abs(
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return diff < 60 * 1000;
};

const ChatFeed = ({
  messages,
  isAdmin,
  currentFingerprint,
  currentGithubId,
  hasMore,
  isLoadingOlder,
  isInitialLoading,
  onLoadOlder,
  onReact,
  onEdit,
  onDelete,
  onTogglePublic,
  onBlock,
  onReplySent,
}: ChatFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // 최신 메시지 수 추적 (새 메시지 도착 시 하단 유지용)
  const prevMessageCountRef = useRef(0);
  // isLoadingOlder를 ref로 추적 — observer effect dependency에서 제거해 재구독 루프 방지
  const isLoadingOlderRef = useRef(isLoadingOlder);
  useEffect(() => {
    isLoadingOlderRef.current = isLoadingOlder;
  }, [isLoadingOlder]);

  // 새 메시지가 추가되면 자동 스크롤 (flex-col-reverse: scrollTop=0이 시각적 맨 아래)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prev = prevMessageCountRef.current;
    const next = messages.length;
    if (next > prev) {
      const threshold = 120;
      if (container.scrollTop < threshold) {
        container.scrollTop = 0;
      }
    }
    prevMessageCountRef.current = next;
  }, [messages]);

  // IntersectionObserver — sentinel이 보이면 loadOlder 호출
  // isLoadingOlder는 ref로 읽어 observer 재구독 루프를 방지
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (isLoadingOlderRef.current) return;
        onLoadOlder();
      },
      { root: container, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadOlder]);

  if (isInitialLoading) return <ChatFeedSkeleton />;

  return (
    // flex-col-reverse + overflow-y-auto: scrollTop=0이 시각적 맨 아래 (Discord/Slack 방식)
    <div
      ref={containerRef}
      className="relative flex flex-col-reverse h-full overflow-y-auto border border-border rounded-2xl p-4"
    >
      {/* 시각적 맨 위 sentinel — DOM 끝 = flex-col-reverse로 시각적 맨 위 */}
      <div ref={sentinelRef} className="h-1" />


      {messages.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-weak text-sm">아직 아무것도 없어요</p>
        </div>
      ) : (
        messages
          .filter((m) => m.parentId === null)
          .reverse()
          .map((message, idx, arr) => {
            const isMine = computeIsMine(
              message,
              isAdmin,
              currentFingerprint,
              currentGithubId
            );
            // reverse 배열: arr[idx+1]이 시각적 위(더 오래된), arr[idx-1]이 시각적 아래(더 최신)
            const olderNeighbor = arr[idx + 1];
            const newerNeighbor = arr[idx - 1];
            const groupedWithOlder =
              !!olderNeighbor &&
              isSameAuthor(message, olderNeighbor) &&
              isWithinOneMinute(message, olderNeighbor);
            const groupedWithNewer =
              !!newerNeighbor &&
              isSameAuthor(message, newerNeighbor) &&
              isWithinOneMinute(message, newerNeighbor);
            return (
              <MessageBubble
                key={message._id}
                message={message}
                isMine={isMine}
                isAdmin={isAdmin}
                showAuthor={!groupedWithOlder}
                showTime={!groupedWithNewer}
                currentFingerprint={currentFingerprint}
                currentGithubId={currentGithubId}
                onReact={onReact}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePublic={onTogglePublic}
                onBlock={onBlock}
                onReplySent={onReplySent}
              />
            );
          })
      )}
    </div>
  );
};

export default ChatFeed;
