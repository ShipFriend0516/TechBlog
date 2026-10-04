'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import {
  PostSkeletonList,
  ReferrerSkeletonList,
  WeeklySkeletonChart,
} from '@/app/entities/admin/analytics/AnalyticsSkeletons';
import { fetchAdminJson } from '@/app/entities/admin/analytics/fetchAnalytics';
import PopularPostTable from '@/app/entities/admin/analytics/PopularPostTable';
import ReferrerTable from '@/app/entities/admin/analytics/ReferrerTable';
import WeeklyChart from '@/app/entities/admin/analytics/WeeklyChart';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import ErrorState from '@/app/entities/admin/common/ErrorState';
import { DailyView, PopularPostItem, ReferrerItem } from '@/app/types/Admin';

const TABS = [
  { key: 'all', label: '전체 인기 글' },
  { key: 'weekly', label: '최근 2주' },
  { key: 'today', label: '오늘 인기 글' },
  { key: 'referrer', label: '유입경로' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface TabData {
  all: PopularPostItem[];
  today: PopularPostItem[];
  weekly: DailyView[];
  referrer: ReferrerItem[];
}

// 탭별 데이터 로더
const TAB_LOADERS: { [K in TabKey]: (signal: AbortSignal) => Promise<TabData[K]> } = {
  all: (signal) =>
    fetchAdminJson(
      '/api/admin/analytics/popular?type=all',
      (data) => data.posts as PopularPostItem[],
      signal
    ),
  today: (signal) =>
    fetchAdminJson(
      '/api/admin/analytics/popular?type=today',
      (data) => data.posts as PopularPostItem[],
      signal
    ),
  weekly: (signal) =>
    fetchAdminJson('/api/admin/stats/daily', (data) => data.daily as DailyView[], signal),
  referrer: (signal) =>
    fetchAdminJson(
      '/api/admin/analytics/referrers',
      (data) => data.referrers as ReferrerItem[],
      signal
    ),
};

const omitKey = <T extends object>(obj: Partial<T>, key: keyof T): Partial<T> => {
  const next = { ...obj };
  delete next[key];
  return next;
};

const isTabKey = (value: string | null): value is TabKey =>
  TABS.some(({ key }) => key === value);

const LoadingSkeleton = ({ tab }: { tab: TabKey }) => {
  if (tab === 'referrer') return <ReferrerSkeletonList />;
  if (tab === 'weekly') return <WeeklySkeletonChart />;
  return <PostSkeletonList />;
};

const EmptyMessage = ({ children }: { children: string }) => (
  <p className="rounded-xl bg-surface px-6 py-12 text-center text-sm text-fg-muted">
    {children}
  </p>
);

const AnalyticsContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab: TabKey = isTabKey(tabParam) ? tabParam : 'all';

  // 한 번 불러온 탭은 캐시해서 탭 전환 시 재요청/스켈레톤 깜빡임을 없앤다
  const [cache, setCache] = useState<Partial<TabData>>({});
  const [errors, setErrors] = useState<Partial<Record<TabKey, string>>>({});
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (cache[tab] !== undefined || errors[tab]) return;

    const controller = new AbortController();
    TAB_LOADERS[tab](controller.signal)
      .then((data) => setCache((prev) => ({ ...prev, [tab]: data })))
      .catch(() => {
        if (controller.signal.aborted) return;
        setErrors((prev) => ({
          ...prev,
          [tab]: '데이터를 불러오는 중 오류가 발생했습니다.',
        }));
      });

    return () => controller.abort();
  }, [tab, reloadToken]);

  const reloadTab = () => {
    setCache((prev) => omitKey(prev, tab));
    setErrors((prev) => omitKey(prev, tab));
    setReloadToken((token) => token + 1);
  };

  const handleTabChange = (key: TabKey) => {
    // 탭 전환은 히스토리를 쌓지 않고 URL 만 동기화
    router.replace(`${pathname}?tab=${key}`, { scroll: false });
  };

  const error = errors[tab];
  const isLoading = !error && cache[tab] === undefined;

  const renderContent = () => {
    if (error) return <ErrorState message={error} onRetry={reloadTab} />;
    if (isLoading) return <LoadingSkeleton tab={tab} />;

    switch (tab) {
      case 'weekly':
        return <WeeklyChart daily={cache.weekly!} />;
      case 'referrer':
        return cache.referrer!.length === 0 ? (
          <EmptyMessage>유입경로 데이터가 없습니다.</EmptyMessage>
        ) : (
          <ReferrerTable referrers={cache.referrer!} />
        );
      case 'all':
      case 'today': {
        const posts = cache[tab]!;
        return posts.length === 0 ? (
          <EmptyMessage>
            {tab === 'all' ? '데이터가 없습니다.' : '오늘 조회된 게시글이 없습니다.'}
          </EmptyMessage>
        ) : (
          <PopularPostTable posts={posts} mode={tab} />
        );
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AdminPageHeader
        title="방문자 및 조회수 분석"
        actions={
          <button
            onClick={reloadTab}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-2 text-sm font-medium text-fg hover:bg-raised/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            새로고침
          </button>
        }
      />

      <div
        role="tablist"
        aria-label="분석 항목"
        className="flex border-b border-hairline mb-6 overflow-x-auto"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => handleTabChange(key)}
            className={`shrink-0 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === key
                ? 'border-accent/40 text-accent'
                : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel">{renderContent()}</div>
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
