'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ErrorState from '@/app/entities/admin/common/ErrorState';
import { DailyView } from '@/app/types/Admin';
import DailyViewsChart from './RecentViewChart';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * 카운트업 애니메이션 숫자.
 * 프레임마다 갱신되는 상태를 이 컴포넌트 내부로 격리해
 * 부모(QuickStats)와 차트가 매 프레임 리렌더링되지 않도록 한다.
 */
const CountUpNumber = memo(function CountUpNumber({
  target,
  duration = 1200,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0 || prefersReducedMotion()) {
      rafRef.current = requestAnimationFrame(() => setCount(target));
    } else {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
});

interface Stats {
  totalPosts: number;
  totalSeries: number;
  publicPosts: number;
  privatePosts: number;
  activeSubscribers: number;
  totalViews: number;
  todayViews: number;
}

const QuickStatsSkeleton = () => (
  <div className="py-4 animate-pulse">
    <div className="h-7 w-28 bg-raised rounded mb-6" />
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="border border-hairline rounded-lg p-5">
          <div className="h-4 w-20 bg-raised rounded mb-3" />
          <div className="h-12 w-32 bg-raised rounded" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border border-hairline rounded-lg p-4">
          <div className="h-3 w-14 bg-raised rounded mb-2" />
          <div className="h-8 w-10 bg-raised rounded" />
        </div>
      ))}
    </div>
  </div>
);

// 상태를 건드리지 않는 순수 로더 — effect 에서는 결과를 받아 setState 만 수행
const loadStats = async (
  signal: AbortSignal
): Promise<{ stats: Stats; daily: DailyView[] }> => {
  const [blogStatsRes, subscriberStatsRes, dailyRes] = await Promise.all([
    fetch('/api/admin/stats', { signal }),
    fetch('/api/admin/subscribers', { signal }),
    fetch('/api/admin/stats/daily', { signal }),
  ]);

  if (!blogStatsRes.ok || !subscriberStatsRes.ok) {
    throw new Error('통계를 불러오는 중 오류가 발생했습니다.');
  }

  const [blogData, subscriberData, dailyData] = await Promise.all([
    blogStatsRes.json(),
    subscriberStatsRes.json(),
    dailyRes.ok ? dailyRes.json() : null,
  ]);

  if (!blogData.success || !subscriberData.success) {
    throw new Error('통계를 불러올 수 없습니다.');
  }

  return {
    stats: {
      ...blogData.stats,
      activeSubscribers: subscriberData.stats.activeSubscribers,
    },
    daily: dailyData?.success ? dailyData.daily : [],
  };
};

const QuickStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal)
      .then(({ stats: nextStats, daily }) => {
        setStats(nextStats);
        setDailyViews(daily);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : '통계를 불러오는 중 오류가 발생했습니다.');
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

  if (loading) return <QuickStatsSkeleton />;

  if (error || !stats) {
    return (
      <div className="py-4">
        <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>
        <ErrorState
          message={error || '통계를 불러올 수 없습니다.'}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const secondaryStats = [
    { label: '전체 게시글', value: stats.totalPosts },
    { label: '전체 시리즈', value: stats.totalSeries },
    { label: '공개 게시글', value: stats.publicPosts },
    { label: '비공개 게시글', value: stats.privatePosts },
    { label: '활성 구독자', value: stats.activeSubscribers },
  ];

  return (
    <div className="py-4">
      <h3 className="text-xl font-semibold mb-6">블로그 통계</h3>

      {/* 조회수 강조 섹션 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-hairline rounded-lg p-5">
          <p className="text-sm text-fg-muted mb-2">전체 조회수</p>
          <p className="text-3xl sm:text-5xl font-bold tracking-tight tabular-nums">
            <CountUpNumber target={stats.totalViews} />
          </p>
        </div>
        <div className="border border-hairline rounded-lg p-5">
          <p className="text-sm text-fg-muted mb-2">오늘 조회수</p>
          <p className="text-3xl sm:text-5xl font-bold tracking-tight tabular-nums">
            <CountUpNumber target={stats.todayViews} />
          </p>
        </div>
      </div>

      {/* 기타 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {secondaryStats.map(({ label, value }) => (
          <div key={label} className="border border-hairline rounded-lg p-4">
            <p className="text-xs text-fg-muted mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <DailyViewsChart data={dailyViews} />
    </div>
  );
};

export default QuickStats;
