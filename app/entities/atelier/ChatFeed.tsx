'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
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
  // 관리자는 owner 역할의 메시지를 모두 내 것으로 본다
  if (isAdmin && message.role === 'owner') return true;
  // GitHub 로그인 방문자는 githubId 로 매칭
  if (githubId && message.author.githubId === githubId) return true;
  // 익명 방문자는 fingerprint 매칭
  if (fingerprint && message.author.fingerprint === fingerprint) return true;
  return false;
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
  onDelete,
  onTogglePublic,
  onBlock,
  onReplySent,
}: ChatFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // prepend 전 스크롤 높이 저장 (loadOlder 요청 시점에 세팅)
  const savedScrollHeightRef = useRef<number | null>(null);
  // 최초 마운트 여부 — 첫 렌더 때만 bottom 으로 스크롤
  const hasScrolledToBottomRef = useRef(false);
  // 최신 메시지 수 추적 (새 메시지 도착 시 하단 유지용)
  const prevMessageCountRef = useRef(0);

  // 초기 로드 시 하단으로 스크롤 — 페인트 전에 실행해 플래시 방지
  useLayoutEffect(() => {
    if (isInitialLoading) return;
    if (hasScrolledToBottomRef.current) return;
    if (!containerRef.current) return;
    if (messages.length === 0) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    hasScrolledToBottomRef.current = true;
    prevMessageCountRef.current = messages.length;
  }, [isInitialLoading, messages.length]);

  // prepend 시 스크롤 보정 (scrollHeight delta 만큼 내려서 위치 유지)
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (savedScrollHeightRef.current == null) return;
    const delta = container.scrollHeight - savedScrollHeightRef.current;
    if (delta > 0) {
      container.scrollTop = container.scrollTop + delta;
    }
    savedScrollHeightRef.current = null;
  }, [messages]);

  // 새 메시지가 하단에 추가되면 자동 스크롤 (위쪽 prepend 는 제외)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!hasScrolledToBottomRef.current) return;
    if (savedScrollHeightRef.current != null) return;

    const prev = prevMessageCountRef.current;
    const next = messages.length;
    if (next > prev) {
      // 사용자가 거의 하단에 있을 때만 자동 스크롤
      const threshold = 120;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom < threshold) {
        container.scrollTop = container.scrollHeight;
      }
    }
    prevMessageCountRef.current = next;
  }, [messages]);

  // IntersectionObserver — 상단 sentinel 이 보이면 loadOlder 호출
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (isLoadingOlder) return;
        // prepend 전 scrollHeight 저장
        savedScrollHeightRef.current = container.scrollHeight;
        onLoadOlder();
      },
      { root: container, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingOlder, onLoadOlder]);

  if (isInitialLoading) return <ChatFeedSkeleton />;

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 h-[70dvh] overflow-y-auto border border-border rounded-2xl p-4 scroll-smooth"
    >
      {/* 상단 sentinel — infinite scroll 트리거 */}
      <div ref={sentinelRef} className="h-1" />

      {hasMore && isLoadingOlder && (
        <p className="text-center text-xs text-weak">이전 메시지 불러오는 중...</p>
      )}

      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-weak text-sm">아직 아무것도 없어요</p>
        </div>
      ) : (
        messages
          .filter((m) => m.parentId === null)
          .map((message) => {
            const isMine = computeIsMine(
              message,
              isAdmin,
              currentFingerprint,
              currentGithubId
            );
            return (
              <MessageBubble
                key={message._id}
                message={message}
                isMine={isMine}
                isAdmin={isAdmin}
                currentFingerprint={currentFingerprint}
                currentGithubId={currentGithubId}
                onReact={onReact}
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
