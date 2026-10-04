import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/app/lib/site';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/subscribe/verified` },
};

export default async function VerifiedPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const isAlreadyVerified = searchParams.message === 'already_verified';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent-subtle">
            <svg
              className="h-10 w-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-fg mb-4">
          {isAlreadyVerified ? '이미 구독 중입니다' : '구독이 완료되었습니다!'}
        </h1>

        <p className="text-fg-soft mb-8">
          {isAlreadyVerified
            ? '이미 인증된 이메일입니다. 새 글이 발행되면 이메일로 알림을 받으실 수 있습니다.'
            : '이메일 인증이 완료되었습니다. 앞으로 새 글이 발행되면 이메일로 알림을 받으실 수 있습니다.'}
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-fg text-base px-6 py-3 rounded-md font-medium hover:bg-fg/80 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/posts"
            className="block w-full border border-hairline text-fg px-6 py-3 rounded-md font-medium hover:bg-surface transition-colors"
          >
            블로그 글 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
