'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'loading' | 'done' | 'error';

const NewsletterForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('done');
      setMessage(data.message ?? '인증 이메일을 보냈어요. 메일함을 확인해주세요.');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : '구독 요청에 실패했어요. 잠시 후 다시 시도해주세요.'
      );
    }
  };

  if (status === 'done') {
    return <p className="text-sm text-accent leading-6">{message}</p>;
  }

  const inputClass =
    'w-full rounded-xl bg-raised px-4 py-3 text-sm text-fg placeholder:text-fg-faint outline-none transition-shadow focus:ring-2 focus:ring-accent-strong';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임"
        aria-label="닉네임"
        minLength={2}
        required
        className={inputClass}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        aria-label="이메일"
        required
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-1 rounded-xl bg-accent py-3 text-sm font-semibold text-on-accent transition-all hover:bg-accent-strong hover:shadow-glow-sm disabled:opacity-60"
      >
        {status === 'loading' ? '요청 중…' : '새 글 소식 받기'}
      </button>
      {status === 'error' && <p className="text-xs text-danger">{message}</p>}
    </form>
  );
};

export default NewsletterForm;
