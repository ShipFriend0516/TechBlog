'use client';
import { Cormorant_Garamond } from 'next/font/google';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
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
    getSnapshot,
    restoreMessage,
    lastAppendedId,
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
      getSnapshot,
      restoreMessage,
    },
  });

  // 닉네임 게이트 노출 여부
  const [isGateOpen, setIsGateOpen] = useState(false);

  // 루트 메시지 전송
  const handleSendRoot = async (content: string) => {
    if (author.needsNickname) {
      setIsGateOpen(true);
      return false;
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

  const handleEdit = async (
    messageId: string,
    content: string
  ): Promise<boolean> => {
    return await mutations.editMessage(messageId, content);
  };

  const handleDelete = async (messageId: string) => {
    await mutations.deleteMessage(messageId);
  };

  const handleTogglePublic = async (messageId: string, isPublic: boolean) => {
    await mutations.togglePublic(messageId, isPublic);
  };

  const handleBlock = async (identifier: string) => {
    await mutations.blockUser(identifier);
  };

  // 답글 전송 후 부모 메시지의 threadCount 만 로컬 갱신
  const handleReplySent = (parentId: string) => {
    const parent = messages.find((m) => m._id === parentId);
    if (parent) {
      updateMessage(parentId, { threadCount: parent.threadCount + 1 });
    }
  };

  const placeholder = author.isAdmin
    ? '생각을 던져보세요... (Enter)'
    : '방문자 댓글... (Enter)';

  return (
    <>
      {/* DarkVeil 배경 */}
      {/* <div className="fixed inset-0 -z-10 opacity-20">
        <LiquidEther
          colors={liquidColors}
          mouseForce={30}
          cursorSize={100}
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={12}
          resolution={0.5}
          isBounce
          autoDemo
          autoSpeed={0.85}
          autoIntensity={3.1}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div> */}

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100dvh-4rem)] flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-4 flex-1 min-h-0 animate-atelierIn duration-1000">
          {/* 헤더 */}
          <div className="shrink-0 flex justify-between items-end">
            <div>
              <h1
                className={`${cormorant.className} text-[clamp(2rem,8vw,3.5rem)] font-light italic tracking-wide relative inline-block`}
              >
                Atelier
                <Image
                  src="/images/atelier/pen.png"
                  alt="pen"
                  width={1024}
                  height={1024}
                  priority
                  className="absolute -right-[clamp(3rem,8vw,6.5rem)] top-1/3 -translate-y-2/4 rotate-[10deg] w-[clamp(4rem,10vw,8rem)] h-[clamp(4rem,10vw,8rem)] -z-10 opacity-90 dark:invert"
                />
              </h1>
              <p className="text-sm text-weak mt-1 tracking-widest uppercase">
                생각들을 던져두는 곳
              </p>
            </div>
            {/* 이전 메시지 로딩 스피너 — 공간 유지하며 숨김/표시 */}
            <div className={`pb-1 ${hasMore ? '' : 'hidden'}`}>
              <div
                className={`w-3 h-3 rounded-full border-2 border-border border-t-weak transition-opacity duration-200 ${isLoadingOlder ? 'opacity-100 animate-spin' : 'opacity-0'}`}
              />
            </div>
          </div>

          {/* 채팅 피드 */}
          <div className="flex-1 min-h-0">
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              onBlock={handleBlock}
              onReplySent={handleReplySent}
              lastAppendedId={lastAppendedId}
            />
          </div>

          {/* 입력 */}
          <div className="shrink-0">
            <MessageInput
              onSend={handleSendRoot}
              placeholder={placeholder}
              isAdmin={author.isAdmin}
            />
          </div>

          {/* 닉네임 게이트 (익명 방문자 전용) */}
          {isGateOpen &&
            createPortal(
              <NicknameGate
                onSubmit={handleSubmitNickname}
                onClose={handleCloseGate}
              />,
              document.body
            )}
        </div>
      </section>
    </>
  );
};

export default AtelierPage;
