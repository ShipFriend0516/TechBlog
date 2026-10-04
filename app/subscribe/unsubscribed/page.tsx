import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function UnsubscribedPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const isAlreadyUnsubscribed = searchParams.message === 'already_unsubscribed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-surface rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-raised">
            <svg
              className="h-10 w-10 text-fg-soft"
              fill="none"
              stroke="currentColor"
              viewBox="0 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-fg mb-4">
          {isAlreadyUnsubscribed
            ? '이미 구독이 취소되었습니다'
            : '구독이 취소되었습니다'}
        </h1>

        <p className="text-fg-soft mb-8">
          {isAlreadyUnsubscribed
            ? '이미 구독이 취소된 상태입니다. 더 이상 이메일 알림을 받지 않습니다.'
            : '구독이 성공적으로 취소되었습니다. 앞으로 새 글 알림 이메일을 받지 않으실 것입니다. 그동안 구독해주셔서 감사합니다.'}
        </p>

        <p className="text-sm text-fg-muted mb-6">
          언제든지 다시 구독하실 수 있습니다.
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
