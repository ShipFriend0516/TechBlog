import Link from 'next/link';

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const isAlreadyUnsubscribed = searchParams.message === 'already_unsubscribed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-10 w-10 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isAlreadyUnsubscribed
            ? '이미 구독이 취소되었습니다'
            : '구독이 취소되었습니다'}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {isAlreadyUnsubscribed
            ? '이미 구독이 취소된 상태입니다. 더 이상 이메일 알림을 받지 않습니다.'
            : '구독이 성공적으로 취소되었습니다. 앞으로 새 글 알림 이메일을 받지 않으실 것입니다. 그동안 구독해주셔서 감사합니다.'}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          언제든지 다시 구독하실 수 있습니다.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/posts"
            className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            블로그 글 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
