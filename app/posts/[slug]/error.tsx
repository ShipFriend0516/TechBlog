'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Post detail error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          글을 불러오는데 실패했습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message === 'Post not found'
            ? '요청하신 글을 찾을 수 없습니다.'
            : '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary-mountain text-white rounded-lg hover:bg-primary-mountain-dark transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/posts"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            목록으로
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-500 dark:text-gray-600">
            오류 ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
