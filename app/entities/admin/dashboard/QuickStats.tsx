'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalPosts: number;
  totalSeries: number;
  publicPosts: number;
  privatePosts: number;
}

const QuickStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.error || '통계를 불러올 수 없습니다.');
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
        <h3 className="text-xl font-semibold mb-4">빠른 통계</h3>
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">빠른 통계</h3>
        <div className="text-red-500">{error || '통계를 불러올 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">빠른 통계</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">전체 게시글</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">전체 시리즈</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalSeries}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">공개 게시글</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.publicPosts}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">비공개 게시글</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.privatePosts}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
