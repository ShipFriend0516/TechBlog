'use client';
import { useState } from 'react';

interface Chat {
  id: string;
  message: string;
  timestamp: number;
}

const AtelierPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  return (
    <section className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        {/* 채팅 피드 영역 */}
        <div className="flex-1 min-h-[600px] border border-border rounded-xl p-4">
          <p className="text-weak text-center mt-40">아직 아무것도 없어요</p>
        </div>

        {/* 입력 영역 */}
        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 resize-none rounded-xl border border-border bg-transparent p-3 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
            rows={2}
            placeholder="생각을 던져보세요..."
          />
          <button className="px-4 py-3 rounded-xl bg-brand-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            전송
          </button>
        </div>
      </div>
    </section>
  );
};

export default AtelierPage;
