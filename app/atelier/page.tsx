'use client';
import { Cormorant_Garamond } from 'next/font/google';
import { useState } from 'react';
import ChatFeed from '@/app/entities/atelier/ChatFeed';
import MessageInput from '@/app/entities/atelier/MessageInput';
import NicknameGate from '@/app/entities/atelier/NicknameGate';
import useAtelierAuthor from '@/app/hooks/atelier/useAtelierAuthor';
import useAtelierMessages from '@/app/hooks/atelier/useAtelierMessages';
import useAtelierMutations from '@/app/hooks/atelier/useAtelierMutations';
import useToast from '@/app/hooks/useToast';
import { AtelierEmoji } from '@/app/types/Atelier';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
});

const AtelierPage = () => {
  const toast = useToast();
  const author = useAtelierAuthor();

  const {
    messages,
    hasMore,
    isInitialLoading,
    isLoadingOlder,
    loadOlder,
    appendOptimistic,
    replaceOptimistic,
    removeOptimistic,
    updateMessage,
    removeMessage,
  } = useAtelierMessages({ limit: 30 });

  const mutations = useAtelierMutations({
    author: {
      nickname: author.nickname,
      githubId: author.githubUser?.id,
      avatarUrl: author.githubUser?.image,
      fingerprint: author.fingerprint,
      isAdmin: author.isAdmin,
    },
    messagesApi: {
      appendOptimistic,
      replaceOptimistic,
      removeOptimistic,
      updateMessage,
      removeMessage,
    },
  });

  // 닉네임 게이트 노출 여부
  const [isGateOpen, setIsGateOpen] = useState(false);

  // 루트 메시지 전송
  const handleSendRoot = async (content: string) => {
    if (author.needsNickname) {
      setIsGateOpen(true);
      return;
    }
    await mutations.sendMessage(content);
  };

  const handleSubmitNickname = (nickname: string) => {
    author.setNickname(nickname);
    setIsGateOpen(false);
    toast.success(`${nickname}님, 환영해요!`);
  };

  const handleCloseGate = () => {
    setIsGateOpen(false);
  };

  const handleReact = async (messageId: string, emoji: AtelierEmoji) => {
    await mutations.toggleReaction(messageId, emoji);
  };

  const handleDelete = async (messageId: string) => {
    await mutations.deleteMessage(messageId);
  };

  const handleTogglePublic = async (messageId: string, isPublic: boolean) => {
    await mutations.togglePublic(messageId, isPublic);
  };

  const handleBlock = async (fingerprint: string) => {
    await mutations.blockFingerprint(fingerprint);
  };

  // 답글 전송 후 부모 메시지의 threadCount 만 로컬 갱신
  const handleReplySent = (parentId: string) => {
    const parent = messages.find((m) => m._id === parentId);
    if (parent) {
      updateMessage(parentId, { threadCount: parent.threadCount + 1 });
    }
  };

  const placeholder = author.isAdmin
    ? '생각을 던져보세요... (⌘+Enter)'
    : '방문자 댓글... (⌘+Enter)';

  return (
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 animate-atelierIn duration-1000">
        {/* 헤더 */}
        <div className="mb-2">
          <h1
            className={`${cormorant.className} text-6xl sm:text-7xl font-light italic tracking-wide`}
          >
            Atelier
          </h1>
          <p className="text-sm text-weak mt-1 tracking-widest uppercase">
            생각들을 던져두는 곳
          </p>
        </div>

        {/* 채팅 피드 */}
        <ChatFeed
          messages={messages}
          isAdmin={author.isAdmin}
          currentFingerprint={author.fingerprint}
          currentGithubId={author.githubUser?.id ?? null}
          hasMore={hasMore}
          isLoadingOlder={isLoadingOlder}
          isInitialLoading={isInitialLoading}
          onLoadOlder={loadOlder}
          onReact={handleReact}
          onDelete={handleDelete}
          onTogglePublic={handleTogglePublic}
          onBlock={handleBlock}
          onReplySent={handleReplySent}
        />

        {/* 입력 */}
        <MessageInput onSend={handleSendRoot} placeholder={placeholder} />

        {/* 닉네임 게이트 (익명 방문자 전용) */}
        {isGateOpen && (
          <NicknameGate
            onSubmit={handleSubmitNickname}
            onClose={handleCloseGate}
          />
        )}
      </div>
    </section>
  );
};

export default AtelierPage;
