'use client';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa6';

interface NicknameGateProps {
  onSubmit?: (nickname: string) => void;
  onClose?: () => void;
}

// 익명 방문자가 닉네임을 입력하는 간단한 모달 게이트
const NicknameGate = ({ onClose }: NicknameGateProps) => {
  // const [value, setValue] = useState('');
  // const [error, setError] = useState<string | null>(null);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(e.target.value);
  //   if (error) setError(null);
  // };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const trimmed = value.trim();
  //   if (trimmed.length < 3 || trimmed.length > 20) {
  //     setError('닉네임은 3-20자여야 해요');
  //     return;
  //   }
  //   onSubmit(trimmed);
  // };

  const handleGithubLogin = () => {
    signIn('github');
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white dark:bg-neutral-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          로그인이 필요해요
        </h2>
        <p className="text-xs text-weak mb-4">
          GitHub 계정으로 로그인하면 댓글을 남길 수 있어요.
        </p>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-border text-sm text-foreground py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <FaGithub />
          GitHub으로 로그인
        </button>

        {/* 닉네임(익명) 로그인 비활성화
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="예: 지나가던 개발자"
            minLength={3}
            maxLength={20}
            autoFocus
            className="rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-primary"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="rounded-xl bg-brand-primary text-white text-sm font-medium py-2 hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </form>
        */}

        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="w-full mt-2 text-xs text-weak hover:underline"
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
};

export default NicknameGate;
