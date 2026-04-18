'use client';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AtelierMessage,
  GetMessagesResponse,
  OptimisticAtelierMessage,
} from '@/app/types/Atelier';

interface UseAtelierMessagesOptions {
  limit?: number;
}

interface UseAtelierMessagesReturn {
  messages: AtelierMessage[];
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingOlder: boolean;
  error: Error | null;
  loadOlder: () => Promise<void>;
  appendOptimistic: (msg: OptimisticAtelierMessage) => void;
  replaceOptimistic: (tempId: string, real: AtelierMessage) => void;
  removeOptimistic: (tempId: string) => void;
  updateMessage: (id: string, patch: Partial<AtelierMessage>) => void;
  removeMessage: (id: string) => void;
  getSnapshot: (id: string) => AtelierMessage | undefined;
  restoreMessage: (msg: AtelierMessage) => void;
  refresh: () => Promise<void>;
}

// 메시지 맵 → ASC 정렬 배열
const toSortedArray = (map: Map<string, AtelierMessage>): AtelierMessage[] => {
  return Array.from(map.values()).sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return aTime - bTime;
  });
};

const useAtelierMessages = (
  options: UseAtelierMessagesOptions = {}
): UseAtelierMessagesReturn => {
  const limit = options.limit ?? 30;

  // 내부 상태는 Map 으로 보관 (id / tempId 로 dedup)
  const [messageMap, setMessageMap] = useState<Map<string, AtelierMessage>>(
    new Map()
  );
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 최상단(가장 오래된) 메시지의 createdAt 커서
  const oldestCursorRef = useRef<string | null>(null);

  // 현재 가장 오래된 실제 메시지의 createdAt 을 계산
  const computeOldestCursor = (
    map: Map<string, AtelierMessage>
  ): string | null => {
    let oldest: string | null = null;
    map.forEach((msg) => {
      // optimistic 메시지는 _id 가 tempId 와 같으므로 제외
      if ((msg as OptimisticAtelierMessage).tempId) return;
      if (!oldest || new Date(msg.createdAt) < new Date(oldest)) {
        oldest = msg.createdAt;
      }
    });
    return oldest;
  };

  // 초기 로드 / 새로고침
  const fetchInitial = useCallback(async () => {
    setIsInitialLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<GetMessagesResponse>(
        '/api/atelier/messages',
        { params: { limit } }
      );
      const next = new Map<string, AtelierMessage>();
      for (const m of data.messages) next.set(m._id, m);
      setMessageMap(next);
      setHasMore(data.hasMore);
      oldestCursorRef.current = computeOldestCursor(next);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('메시지를 불러오지 못했어요'));
    } finally {
      setIsInitialLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // 10초 폴링 — 최신 메시지를 가져와 기존 맵에 병합
  useEffect(() => {
    if (isInitialLoading) return;
    const id = setInterval(async () => {
      try {
        const { data } = await axios.get<GetMessagesResponse>(
          '/api/atelier/messages',
          { params: { limit } }
        );
        setMessageMap((prev) => {
          const next = new Map(prev);
          let changed = false;
          for (const m of data.messages) {
            const existing = next.get(m._id);
            if (!existing || existing.updatedAt !== m.updatedAt) {
              next.set(m._id, m);
              changed = true;
            }
          }
          if (!changed) return prev;
          oldestCursorRef.current = computeOldestCursor(next);
          return next;
        });
        setHasMore(data.hasMore);
      } catch {
        // 폴링 실패는 무시
      }
    }, 10_000);
    return () => clearInterval(id);
  }, [isInitialLoading, limit]);

  // 과거 메시지 로드 (cursor 기반)
  const loadOlder = useCallback(async () => {
    if (isLoadingOlder || !hasMore) return;
    const cursor = oldestCursorRef.current;
    if (!cursor) return;

    setIsLoadingOlder(true);
    try {
      const { data } = await axios.get<GetMessagesResponse>(
        '/api/atelier/messages',
        { params: { cursor, limit } }
      );
      setMessageMap((prev) => {
        const next = new Map(prev);
        for (const m of data.messages) {
          if (!next.has(m._id)) next.set(m._id, m);
        }
        oldestCursorRef.current = computeOldestCursor(next);
        return next;
      });
      setHasMore(data.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('과거 메시지를 불러오지 못했어요'));
    } finally {
      setIsLoadingOlder(false);
    }
  }, [isLoadingOlder, hasMore, limit]);

  // Optimistic 메시지 추가 (tempId 를 키로 사용)
  const appendOptimistic = useCallback((msg: OptimisticAtelierMessage) => {
    setMessageMap((prev) => {
      const next = new Map(prev);
      next.set(msg.tempId, msg);
      return next;
    });
  }, []);

  // 서버 응답으로 교체
  const replaceOptimistic = useCallback(
    (tempId: string, real: AtelierMessage) => {
      setMessageMap((prev) => {
        const next = new Map(prev);
        next.delete(tempId);
        next.set(real._id, real);
        // 새 메시지가 최신이므로 cursor 는 갱신 불필요하지만 안전하게 재계산
        oldestCursorRef.current = computeOldestCursor(next);
        return next;
      });
    },
    []
  );

  const removeOptimistic = useCallback((tempId: string) => {
    setMessageMap((prev) => {
      const next = new Map(prev);
      next.delete(tempId);
      return next;
    });
  }, []);

  const updateMessage = useCallback(
    (id: string, patch: Partial<AtelierMessage>) => {
      setMessageMap((prev) => {
        const existing = prev.get(id);
        if (!existing) return prev;
        const next = new Map(prev);
        next.set(id, { ...existing, ...patch });
        return next;
      });
    },
    []
  );

  const removeMessage = useCallback((id: string) => {
    setMessageMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      oldestCursorRef.current = computeOldestCursor(next);
      return next;
    });
  }, []);

  const getSnapshot = useCallback(
    (id: string): AtelierMessage | undefined => {
      return messageMap.get(id);
    },
    [messageMap]
  );

  const restoreMessage = useCallback((msg: AtelierMessage) => {
    setMessageMap((prev) => {
      const next = new Map(prev);
      next.set(msg._id, msg);
      oldestCursorRef.current = computeOldestCursor(next);
      return next;
    });
  }, []);

  const messages = useMemo(() => toSortedArray(messageMap), [messageMap]);

  return {
    messages,
    hasMore,
    isInitialLoading,
    isLoadingOlder,
    error,
    loadOlder,
    appendOptimistic,
    replaceOptimistic,
    removeOptimistic,
    updateMessage,
    removeMessage,
    getSnapshot,
    restoreMessage,
    refresh: fetchInitial,
  };
};

export default useAtelierMessages;
