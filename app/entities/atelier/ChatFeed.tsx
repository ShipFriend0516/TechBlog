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
  lastAppendedId: string | null;
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
  lastAppendedId,
}: ChatFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingOlderRef = useRef(isLoadingOlder);
  const prevScrollHeightRef = useRef(0);
  const isUserNearBottomRef = useRef(true); // 사용자가 맨 아래 근처에 있는지

  useEffect(() => {
    isLoadingOlderRef.current = isLoadingOlder;
  }, [isLoadingOlder]);

  // 초기 로드 후 맨 아래로 스크롤
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isInitialLoading) return;

    // 약간 지연 후 스크롤 (렌더링 완료 대기)
    const timer = setTimeout(() => {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }, 0);

    return () => clearTimeout(timer);
  }, [isInitialLoading]);

  // 스크롤 이벤트 — 과거 메시지 로드 + 사용자가 맨 아래 근처인지 추적
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // 과거 메시지 로드 (위로 300px 이상 스크롤)
      if (scrollTop < 300 && !isLoadingOlderRef.current && hasMore) {
        prevScrollHeightRef.current = scrollHeight;
        onLoadOlder();
      }

      // 사용자가 맨 아래 근처인지 추적 (하단에서 20px 이내)
      isUserNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 20;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, onLoadOlder]);

  // 과거 메시지 로드 후 스크롤 위치 복원
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isLoadingOlder || prevScrollHeightRef.current === 0) return;

    // 로딩 완료 후 스크롤 조정
    const newHeightAdded = container.scrollHeight - prevScrollHeightRef.current;
    if (newHeightAdded > 0) {
      container.scrollTop += newHeightAdded;
    }
    prevScrollHeightRef.current = 0;
  }, [isLoadingOlder]);

  // lastAppendedId가 변할 때만 자동 스크롤 (폴링 업데이트에는 반응 안 함)
  useEffect(() => {
    if (!lastAppendedId) return;
    const container = containerRef.current;
    if (!container || isLoadingOlder) return;
    // 사용자가 이미 맨 아래에 있을 때만 자동 스크롤
    if (isUserNearBottomRef.current) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [lastAppendedId, isLoadingOlder]);

  if (isInitialLoading) return <ChatFeedSkeleton />;

  const rootMessages = messages.filter((m) => m.parentId === null);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full overflow-y-auto border border-border rounded-2xl p-4 scrollbar-custom"
    >
      {rootMessages.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-weak text-sm">아직 아무것도 없어요</p>
        </div>
      ) : (
        rootMessages.map((message, idx, arr) => {
          const isMine = computeIsMine(
            message,
            isAdmin,
            currentFingerprint,
            currentGithubId
          );
          // arr[idx-1]이 이전 메시지(더 오래된), arr[idx+1]이 다음 메시지(더 최신)
          const olderNeighbor = arr[idx - 1];
          const newerNeighbor = arr[idx + 1];
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
