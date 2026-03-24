'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import PostListItem from '@/app/entities/admin/analytics/PostListItem';

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

interface ReferrerItem {
  source: string;
  count: number;
}

const TABS = [
  { key: 'all', label: '전체 인기 글 통계' },
  { key: 'today', label: '오늘 인기 글 통계' },
  { key: 'referrer', label: '유입경로 분석' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function PostSkeletonList() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
      <ul>
        {[...Array(20)].map((_, i) => (
          <li
            key={i}
            className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-3"
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
    </div>
  );
}

function ReferrerSkeletonList() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
      <ul>
        {[...Array(10)].map((_, i) => (
          <li
            key={i}
            className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-4"
          >
            <div className="h-3.5 w-4 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
            <div className="h-3.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
            <div className="h-3.5 w-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReferrerList({ referrers }: { referrers: ReferrerItem[] }) {
  const total = referrers.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
        <span className="w-4 shrink-0" />
        <span className="flex-1">유입경로</span>
        <span className="w-48 shrink-0 text-left text-gray-400 dark:text-gray-500">URL</span>
        <span className="w-16 shrink-0 text-right">건수</span>
        <span className="w-28 shrink-0 text-right">비율</span>
      </div>
      <ul>
        {referrers.map((item, i) => {
          const percent = total > 0 ? (item.count / total) * 100 : 0;
          const isDirectly = item.source === '직접 방문';
          return (
            <li
              key={item.source}
              className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-4"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium dark:text-gray-200 truncate">
                {item.source}
              </span>
              <span className="w-48 shrink-0 truncate">
                {isDirectly ? (
                  <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/10 dark:text-brand-secondary">
                    {item.source}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold w-16 shrink-0 text-right dark:text-gray-200">
                {item.count.toLocaleString()}
              </span>
              <div className="w-28 shrink-0 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-primary dark:bg-brand-secondary"
                    style={{ width: `${percent.toFixed(1)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right shrink-0">
                  {percent.toFixed(1)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const AnalyticsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'all') as TabKey;

  const [allPosts, setAllPosts] = useState<PostItem[]>([]);
  const [todayPosts, setTodayPosts] = useState<PostItem[]>([]);
  const [referrers, setReferrers] = useState<ReferrerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (tab === 'referrer') {
          const res = await fetch('/api/admin/analytics/referrers');
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          setReferrers(data.referrers);
        } else {
          const res = await fetch(`/api/admin/analytics/popular?type=${tab}`);
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          if (tab === 'all') setAllPosts(data.posts);
          else setTodayPosts(data.posts);
        }
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
    tab === 'all'
      ? '데이터가 없습니다.'
      : tab === 'today'
        ? '오늘 조회된 게시글이 없습니다.'
        : '유입경로 데이터가 없습니다.';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-3"
        >
          <FiArrowLeft size={16} />
          대시보드
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">방문자 및 조회수 분석</h1>
      </div>

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

      {/* 콘텐츠 */}
      {loading ? (
        tab === 'referrer' ? <ReferrerSkeletonList /> : <PostSkeletonList />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tab === 'referrer' ? (
        referrers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
        ) : (
          <ReferrerList referrers={referrers} />
        )
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
            <span className="w-4 shrink-0" />
            <span className="flex-1">제목</span>
            <span className="w-20 shrink-0 text-center">시리즈</span>
            <span className="w-24 shrink-0 text-center">작성일</span>
            <span className="w-12 shrink-0 text-center">좋아요</span>
            <span className="w-20 shrink-0 text-right">조회수</span>
            <span className="w-4 shrink-0" />
          </div>
          <ul>
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
        </div>
      )}
    </div>
  );
};

export default function StatsPage() {
  return (
    <Suspense>
      <AnalyticsContent />
    </Suspense>
  );
}
