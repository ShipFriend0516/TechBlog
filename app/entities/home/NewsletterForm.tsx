'use client';

import useSubscribe from '@/app/hooks/useSubscribe';

// 검증·요청·결과 토스트는 사이드바 구독 폼과 같은 useSubscribe 훅을 사용
const NewsletterForm = () => {
  const {
    nickname,
    email,
    isLoading,
    isSubmitted,
    setNickname,
    setEmail,
    handleSubmit,
    handleReset,
  } = useSubscribe();

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-accent leading-6">
          인증 이메일을 보냈어요. 메일함을 확인해주세요.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-fg-muted underline hover:text-fg transition-colors"
        >
          다른 이메일로 구독하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임"
        aria-label="닉네임"
        disabled={isLoading}
        className="input-field w-full px-4 py-3"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        aria-label="이메일"
        disabled={isLoading}
        className="input-field w-full px-4 py-3"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-1 rounded-xl bg-accent py-3 text-sm font-semibold text-on-accent transition-all hover:bg-accent-strong hover:shadow-glow-sm disabled:opacity-60"
      >
        {isLoading ? '요청 중…' : '새 글 소식 받기'}
      </button>
    </form>
  );
};

export default NewsletterForm;
