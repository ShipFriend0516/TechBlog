'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

interface Stats {
  totalPosts: number;
  totalSeries: number;
  publicPosts: number;
  privatePosts: number;
  activeSubscribers: number;
  totalViews: number;
  todayViews: number;
}

const QuickStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalViewsCount = useCountUp(stats?.totalViews ?? 0);
  const todayViewsCount = useCountUp(stats?.todayViews ?? 0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [blogStatsRes, subscriberStatsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/subscribers'),
        ]);

        if (!blogStatsRes.ok || !subscriberStatsRes.ok) {
          throw new Error('통계 불러오기 실패');
        }

        const blogData = await blogStatsRes.json();
        const subscriberData = await subscriberStatsRes.json();

        if (blogData.success && subscriberData.success) {
          setStats({
            ...blogData.stats,
            activeSubscribers: subscriberData.stats.activeSubscribers,
          });
        } else {
          setError('통계를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('통계를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>
        <div className="text-red-500">{error || '통계를 불러올 수 없습니다.'}</div>
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
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">블로그 통계</h3>

      {/* 조회수 강조 섹션 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-2">전체 조회수</p>
          <p className="text-5xl font-bold tracking-tight">
            {totalViewsCount.toLocaleString()}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-2">오늘 조회수</p>
          <p className="text-5xl font-bold tracking-tight">
            {todayViewsCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 기타 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {secondaryStats.map(({ label, value }) => (
          <div key={label} className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
