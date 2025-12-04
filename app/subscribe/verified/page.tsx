import Link from 'next/link';

export default function VerifiedPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const isAlreadyVerified = searchParams.message === 'already_verified';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isAlreadyVerified ? '이미 구독 중입니다' : '구독이 완료되었습니다!'}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {isAlreadyVerified
            ? '이미 인증된 이메일입니다. 새 글이 발행되면 이메일로 알림을 받으실 수 있습니다.'
            : '이메일 인증이 완료되었습니다. 앞으로 새 글이 발행되면 이메일로 알림을 받으실 수 있습니다.'}
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
