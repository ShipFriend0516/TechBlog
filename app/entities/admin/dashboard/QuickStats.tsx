'use client';

import { useEffect, useState } from 'react';

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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>
        <div className="text-red-500">{error || '통계를 불러올 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">블로그 통계</h3>

      {/* 조회수 강조 섹션 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-600 text-white p-5 rounded-lg">
          <p className="text-sm text-indigo-200 mb-1">전체 조회수</p>
          <p className="text-4xl font-bold">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-green-600 text-white p-5 rounded-lg">
          <p className="text-sm text-green-100 mb-1">오늘 조회수</p>
          <p className="text-4xl font-bold">{stats.todayViews.toLocaleString()}</p>
        </div>
      </div>

      {/* 기타 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">전체 게시글</p>
          <p className="text-xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">전체 시리즈</p>
          <p className="text-xl font-bold text-green-600">{stats.totalSeries}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">공개 게시글</p>
          <p className="text-xl font-bold text-purple-600">{stats.publicPosts}</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">비공개 게시글</p>
          <p className="text-xl font-bold text-orange-600">{stats.privatePosts}</p>
        </div>
        <div className="bg-teal-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">활성 구독자</p>
          <p className="text-xl font-bold text-teal-600">{stats.activeSubscribers}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
