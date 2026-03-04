'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { formatDate } from '@/app/lib/utils/format';

interface PostItem {
  postId: string;
  title: string;
  slug: string;
  date: number;
  seriesTitle?: string;
  likeCount: number;
  totalViews?: number;
  todayViews: number;
}

const TABS = [
  { key: 'all', label: '전체 인기 글 통계' },
  { key: 'today', label: '오늘 인기 글 통계' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function SkeletonList() {
  return (
    <ul className="animate-pulse space-y-1">
      {[...Array(20)].map((_, i) => (
        <li
          key={i}
          className="px-3 py-2.5 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center gap-3"
        >
          <div className="h-3.5 w-4 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
          <div className="h-3.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
          <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
          <div className="h-3.5 w-14 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
        </li>
      ))}
    </ul>
  );
}

function PostListItem({
  post,
  rank,
  viewsNode,
}: {
  post: PostItem;
  rank: number;
  viewsNode: React.ReactNode;
}) {
  return (
    <li className="px-3 py-2.5 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-3 min-w-0">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">
        {rank}
      </span>
      <Link
        href={`/posts/${post.slug}`}
        className="flex-1 text-sm font-medium truncate dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors min-w-0"
      >
        {post.title}
      </Link>
      <div className="w-20 shrink-0 flex justify-center">
        {post.seriesTitle ? (
          <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/10 dark:text-brand-secondary truncate max-w-full">
            {post.seriesTitle}
          </span>
        ) : (
          <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
        )}
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-24 shrink-0 text-center">
        {formatDate(post.date)}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500 w-12 shrink-0 text-center">
        ♥ {post.likeCount.toLocaleString()}
      </span>
      <span className="text-sm font-semibold shrink-0 w-20 text-right dark:text-gray-200">
        {viewsNode}
      </span>
    </li>
  );
}

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'all') as TabKey;

  const [allPosts, setAllPosts] = useState<PostItem[]>([]);
  const [todayPosts, setTodayPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/analytics/popular?type=${tab}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        if (tab === 'all') setAllPosts(data.posts);
        else setTodayPosts(data.posts);
      } catch {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  const handleTabChange = (key: TabKey) => {
    router.push(`/admin/analytics?tab=${key}`);
  };

  const posts = tab === 'all' ? allPosts : todayPosts;
  const emptyMessage =
    tab === 'all' ? '데이터가 없습니다.' : '오늘 조회된 게시글이 없습니다.';

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        방문자 및 조회수 분석
      </h1>

      {/* 탭 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              tab === key
                ? 'border-b-2 border-brand-primary text-brand-primary dark:border-brand-secondary dark:text-brand-secondary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      {loading ? (
        <SkeletonList />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
      ) : (
        <>
          {/* 테이블 헤더 */}
          <div className="flex items-center gap-3 px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700 mb-1">
            <span className="w-4 shrink-0" />
            <span className="flex-1">제목</span>
            <span className="w-20 shrink-0 text-center">시리즈</span>
            <span className="w-24 shrink-0 text-center">작성일</span>
            <span className="w-12 shrink-0 text-center">좋아요</span>
            <span className="w-20 shrink-0 text-right">조회수</span>
          </div>
          <ul className="space-y-1">
            {posts.map((post, i) => (
              <PostListItem
                key={post.postId}
                post={post}
                rank={i + 1}
                viewsNode={
                  tab === 'all' ? (
                    <>
                      {post.totalViews!.toLocaleString()}
                      {post.todayViews > 0 && (
                        <span className="text-brand-secondary ml-1">
                          (+{post.todayViews})
                        </span>
                      )}
                    </>
                  ) : (
                    <>{post.todayViews.toLocaleString()}회</>
                  )
                }
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function StatsPage() {
  return (
    <Suspense>
      <AnalyticsContent />
    </Suspense>
  );
}
