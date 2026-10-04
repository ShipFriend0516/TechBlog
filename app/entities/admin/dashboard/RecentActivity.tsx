'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import ErrorState from '@/app/entities/admin/common/ErrorState';
import { formatDate } from '@/app/lib/utils/format';

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  date: number;
  createdAt: string;
}

const RecentActivitySkeleton = () => (
  <div className="py-4 animate-pulse">
    <div className="h-7 w-24 bg-raised rounded mb-6" />
    <ul className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between px-4 py-3 border border-hairline rounded-lg"
        >
          <div className="h-4 bg-raised rounded flex-1 mr-4" />
          <div className="h-3 w-16 bg-raised rounded shrink-0" />
        </li>
      ))}
    </ul>
  </div>
);

const loadRecentPosts = async (signal: AbortSignal): Promise<RecentPost[]> => {
  const response = await fetch('/api/admin/posts/recent', { signal });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '최근 게시글을 불러올 수 없습니다.');
  }
  return data.posts;
};

const RecentActivity = () => {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadRecentPosts(controller.signal)
      .then((nextPosts) => {
        setPosts(nextPosts);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : '최근 게시글을 불러오는 중 오류가 발생했습니다.'
        );
        console.error(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadToken]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  if (loading) return <RecentActivitySkeleton />;

  return (
    <div className="py-4">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">최근 활동</h3>
        <Link
          href="/admin/posts"
          prefetch={false}
          className="text-sm text-fg-muted hover:text-accent transition-colors"
        >
          전체 게시글 관리 →
        </Link>
      </div>
      {error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : posts.length === 0 ? (
        <p className="text-fg-muted text-sm">최근 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post._id}
              className="flex items-center justify-between gap-4 px-4 py-3 border border-hairline rounded-lg hover:bg-surface transition-colors duration-200"
            >
              <Link
                href={`/posts/${post.slug}`}
                className="min-w-0 font-medium hover:text-accent transition-colors truncate"
              >
                {post.title}
              </Link>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-fg-muted">
                  {formatDate(post.date)}
                </span>
                <Link
                  href={`/admin/write?slug=${encodeURIComponent(post.slug)}`}
                  prefetch={false}
                  className="text-xs text-fg-muted hover:text-accent transition-colors"
                >
                  수정
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
