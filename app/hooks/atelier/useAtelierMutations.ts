'use client';
import axios from 'axios';
import { useCallback } from 'react';
import useToast from '@/app/hooks/useToast';
import {
  AtelierEmoji,
  AtelierMessage,
  OptimisticAtelierMessage,
  PostMessageResponse,
  PostReactionResponse,
} from '@/app/types/Atelier';

interface AuthorSnapshot {
  nickname: string | null;
  githubId?: string;
  avatarUrl?: string;
  fingerprint: string | null;
  isAdmin: boolean;
}

interface MessagesApi {
  appendOptimistic: (msg: OptimisticAtelierMessage) => void;
  replaceOptimistic: (tempId: string, real: AtelierMessage) => void;
  removeOptimistic: (tempId: string) => void;
  updateMessage: (id: string, patch: Partial<AtelierMessage>) => void;
  removeMessage: (id: string) => void;
  getSnapshot: (id: string) => AtelierMessage | undefined;
  restoreMessage: (msg: AtelierMessage) => void;
}

interface UseAtelierMutationsOptions {
  author: AuthorSnapshot;
  messagesApi: MessagesApi;
}

interface UseAtelierMutationsReturn {
  sendMessage: (
    content: string,
    options?: { parentId?: string }
  ) => Promise<AtelierMessage | null>;
  toggleReaction: (messageId: string, emoji: AtelierEmoji) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<void>;
  togglePublic: (messageId: string, isPublic: boolean) => Promise<void>;
  blockFingerprint: (fingerprint: string, reason?: string) => Promise<void>;
}

// 핑거프린트 헤더 헬퍼
const fingerprintHeaders = (fingerprint: string | null) =>
  fingerprint ? { 'X-Fingerprint': fingerprint } : undefined;

const useAtelierMutations = (
  options: UseAtelierMutationsOptions
): UseAtelierMutationsReturn => {
  const { author, messagesApi } = options;
  const toast = useToast();

  // 메시지 전송 — 낙관적 업데이트 + 롤백
  const sendMessage = useCallback(
    async (
      content: string,
      sendOptions?: { parentId?: string }
    ): Promise<AtelierMessage | null> => {
      const trimmed = content.trim();
      if (!trimmed) return null;

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const nowIso = new Date().toISOString();
      const optimistic: OptimisticAtelierMessage = {
        _id: tempId,
        tempId,
        isSending: true,
        content: trimmed,
        role: author.isAdmin ? 'owner' : 'visitor',
        author: {
          nickname: author.nickname ?? '익명',
          githubId: author.githubId,
          avatarUrl: author.avatarUrl,
          fingerprint: author.fingerprint ?? undefined,
        },
        parentId: sendOptions?.parentId ?? null,
        threadCount: 0,
        reactions: [],
        isPublic: true,
        isDeleted: false,
        isEdited: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      messagesApi.appendOptimistic(optimistic);

      try {
        const { data } = await axios.post<PostMessageResponse>(
          '/api/atelier/messages',
          {
            content: trimmed,
            nickname: author.nickname ?? undefined,
            parentId: sendOptions?.parentId,
          },
          { headers: fingerprintHeaders(author.fingerprint) }
        );
        messagesApi.replaceOptimistic(tempId, data.message);
        return data.message;
      } catch (err) {
        messagesApi.removeOptimistic(tempId);
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          const retryAfter = err.response.data?.retryAfter ?? 60;
          toast.error(`${retryAfter}초 후에 다시 시도해주세요`);
        } else {
          toast.error('메시지를 보내지 못했어요. 다시 시도해주세요.');
        }
        return null;
      }
    },
    [author, messagesApi, toast]
  );

  // 이모지 반응 토글
  const toggleReaction = useCallback(
    async (messageId: string, emoji: AtelierEmoji) => {
      try {
        const { data } = await axios.post<PostReactionResponse>(
          `/api/atelier/messages/${messageId}/reaction`,
          { emoji },
          { headers: fingerprintHeaders(author.fingerprint) }
        );
        messagesApi.updateMessage(messageId, { reactions: data.reactions });
      } catch {
        toast.error('반응을 남기지 못했어요.');
      }
    },
    [author.fingerprint, messagesApi, toast]
  );

  // 메시지 수정
  const editMessage = useCallback(
    async (messageId: string, content: string): Promise<boolean> => {
      try {
        await axios.put(
          `/api/atelier/messages/${messageId}`,
          { content },
          { headers: fingerprintHeaders(author.fingerprint) }
        );
        messagesApi.updateMessage(messageId, { content, isEdited: true });
        return true;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          const retryAfter = err.response.data?.retryAfter ?? 60;
          toast.error(`${retryAfter}초 후에 다시 시도해주세요`);
        } else {
          toast.error('메시지 수정에 실패했어요');
        }
        return false;
      }
    },
    [author.fingerprint, messagesApi, toast]
  );

  // 관리자 삭제 — 낙관적 업데이트 후 실패 시 복구
  const deleteMessage = useCallback(
    async (messageId: string) => {
      const snapshot = messagesApi.getSnapshot(messageId);
      messagesApi.removeMessage(messageId);
      try {
        await axios.delete(`/api/atelier/messages/${messageId}`, {
          headers: fingerprintHeaders(author.fingerprint),
        });
        toast.success('메시지를 삭제했어요.');
      } catch (err) {
        if (snapshot) messagesApi.restoreMessage(snapshot);
        if (axios.isAxiosError(err) && err.response?.status === 429) {
          const retryAfter = err.response.data?.retryAfter ?? 60;
          toast.error(`${retryAfter}초 후에 다시 시도해주세요`);
        } else {
          toast.error('삭제에 실패했어요.');
        }
      }
    },
    [author.fingerprint, messagesApi, toast]
  );

  // 공개/비공개 토글
  const togglePublic = useCallback(
    async (messageId: string, isPublic: boolean) => {
      try {
        await axios.patch(
          `/api/atelier/messages/${messageId}`,
          { isPublic },
          { headers: fingerprintHeaders(author.fingerprint) }
        );
        messagesApi.updateMessage(messageId, { isPublic });
      } catch {
        toast.error('공개 설정 변경에 실패했어요.');
      }
    },
    [author.fingerprint, messagesApi, toast]
  );

  // 핑거프린트 차단
  const blockFingerprint = useCallback(
    async (fingerprint: string, reason?: string) => {
      try {
        await axios.post(
          '/api/atelier/block',
          { fingerprint, reason },
          { headers: fingerprintHeaders(author.fingerprint) }
        );
        toast.success('해당 방문자를 차단했어요.');
      } catch {
        toast.error('차단에 실패했어요.');
      }
    },
    [author.fingerprint, toast]
  );

  return {
    sendMessage,
    toggleReaction,
    editMessage,
    deleteMessage,
    togglePublic,
    blockFingerprint,
  };
};

export default useAtelierMutations;
