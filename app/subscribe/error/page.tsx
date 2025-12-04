import Link from 'next/link';

const errorMessages: Record<string, string> = {
  invalid_token: '유효하지 않은 인증 링크입니다.',
  token_not_found: '인증 정보를 찾을 수 없습니다.',
  token_expired:
    '인증 링크가 만료되었습니다. 다시 구독 신청을 해주세요. (24시간 유효)',
  subscriber_not_found: '구독 정보를 찾을 수 없습니다.',
  server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const errorMessage =
    errorMessages[searchParams.message || ''] ||
    '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-10 w-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          오류가 발생했습니다
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">{errorMessage}</p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
