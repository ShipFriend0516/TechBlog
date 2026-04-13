'use client';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
});

type Role = 'owner' | 'visitor';

interface Chat {
  id: string;
  message: string;
  timestamp: number;
  role: Role;
  nickname?: string;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return new Intl.DateTimeFormat('ko', {
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const DEMO_CHATS: Chat[] = [
  {
    id: 'demo-1',
    message: 'AI에 대한 나의 생각.',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    role: 'owner',
  },
  {
    id: 'demo-2',
    message: '오호 ㅋㅋ',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    role: 'visitor',
    nickname: '익명',
  },
  {
    id: 'demo-3',
    message: '리액트 19도 공부해야겠다.',
    timestamp: Date.now() - 1000 * 60 * 30,
    role: 'owner',
  },
];

const OwnerBubble = ({ chat }: { chat: Chat }) => (
  <div className="flex flex-col items-end gap-1 animate-bubbleInRight">
    <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-primary/80 backdrop-blur-sm text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md">
      {chat.message}
    </div>
    <span className="text-xs text-weak px-1">{formatTime(chat.timestamp)}</span>
  </div>
);

const VisitorBubble = ({ chat }: { chat: Chat }) => (
  <div className="flex flex-col items-start gap-1 animate-bubbleInLeft">
    <span className="text-xs text-weak px-1 ml-1">
      {chat.nickname ?? '익명'}
    </span>
    <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-foreground px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words border border-border shadow-sm">
      {chat.message}
    </div>
    <span className="text-xs text-weak px-1">{formatTime(chat.timestamp)}</span>
  </div>
);

const AtelierPage = () => {
  const [chats, setChats] = useState<Chat[]>(DEMO_CHATS);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<Role>('owner');
  const isComposing = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [chats]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newChat: Chat = {
      id: crypto.randomUUID(),
      message: trimmed,
      timestamp: Date.now(),
      role,
      nickname: role === 'visitor' ? '익명' : undefined,
    };

    setChats((prev) => [...prev, newChat]);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isComposing.current) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        {/* 헤더 */}
        <div className="mb-2">
          <h1
            className={`${cormorant.className} text-6xl sm:text-7xl font-light italic tracking-wide`}
          >
            Atelier
          </h1>
          <p className="text-sm text-weak mt-1 tracking-widest uppercase">
            날 것의 생각들을 던져두는 곳
          </p>
        </div>

        {/* 채팅 피드 */}
        <div
          ref={feedRef}
          className="flex flex-col gap-4 h-[560px] overflow-y-auto border border-border rounded-2xl p-4 scroll-smooth"
        >
          {chats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-weak text-sm">아직 아무것도 없어요</p>
            </div>
          ) : (
            chats.map((chat) =>
              chat.role === 'owner' ? (
                <OwnerBubble key={chat.id} chat={chat} />
              ) : (
                <VisitorBubble key={chat.id} chat={chat} />
              )
            )
          )}
        </div>

        {/* 역할 토글 (프로토타이핑용) */}
        <div className="flex items-center gap-2 text-xs text-weak">
          <span>보내는 사람:</span>
          <button
            onClick={() => setRole('owner')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              role === 'owner'
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'border-border hover:border-brand-primary'
            }`}
          >
            나 (관리자)
          </button>
          <button
            onClick={() => setRole('visitor')}
            className={`px-3 py-1 rounded-full border transition-colors ${
              role === 'visitor'
                ? 'bg-gray-600 text-white border-gray-600'
                : 'border-border hover:border-gray-400'
            }`}
          >
            방문자
          </button>
        </div>

        {/* 입력 영역 */}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onCompositionStart={() => {
              isComposing.current = true;
            }}
            onCompositionEnd={() => {
              isComposing.current = false;
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none rounded-xl border border-border bg-transparent p-3 text-sm outline-none focus:ring-1 focus:ring-brand-primary transition-all"
            rows={2}
            placeholder={
              role === 'owner'
                ? '생각을 던져보세요... (⌘+Enter)'
                : '방문자 댓글... (⌘+Enter)'
            }
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-brand-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
          >
            전송
          </button>
        </div>
      </div>
    </section>
  );
};

export default AtelierPage;
