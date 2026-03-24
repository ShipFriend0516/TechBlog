'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FiArrowLeft, FiBarChart2 } from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

interface DailyPost {
  postId: string;
  title: string;
  slug: string;
  views: number;
}

interface DailyView {
  date: string;
  count: number;
}

interface ReferrerItem {
  source: string;
  count: number;
}

const TABS = [
  { key: 'all', label: '전체 인기 글 통계' },
  { key: 'weekly', label: '최근 2주 통계' },
  { key: 'today', label: '오늘 인기 글 통계' },
  { key: 'referrer', label: '유입경로 분석' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/* ─── 스켈레톤 ─── */
function PostSkeletonList() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
      <ul>
        {[...Array(20)].map((_, i) => (
          <li key={i} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-3">
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
          <li key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-4">
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

function WeeklySkeletonChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}

/* ─── 유입경로 리스트 ─── */
function ReferrerList({ referrers }: { referrers: ReferrerItem[] }) {
  const total = referrers.reduce((sum, r) => sum + r.count, 0);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
        <span className="w-4 shrink-0" />
        <span className="flex-1">유입경로</span>
        <span className="w-48 shrink-0 text-left">URL</span>
        <span className="w-16 shrink-0 text-right">건수</span>
        <span className="w-28 shrink-0 text-right">비율</span>
      </div>
      <ul>
        {referrers.map((item, i) => {
          const percent = total > 0 ? (item.count / total) * 100 : 0;
          const isDirect = item.source === '직접 방문';
          return (
            <li key={item.source} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-4">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">{i + 1}</span>
              <span className="flex-1 text-sm font-medium dark:text-gray-200 truncate">{item.source}</span>
              <span className="w-48 shrink-0 truncate">
                {isDirect ? (
                  <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/10 dark:text-brand-secondary">
                    {item.source}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold w-16 shrink-0 text-right dark:text-gray-200">{item.count.toLocaleString()}</span>
              <div className="w-28 shrink-0 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-primary dark:bg-brand-secondary" style={{ width: `${percent.toFixed(1)}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right shrink-0">{percent.toFixed(1)}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─── 2주 차트 ─── */
function WeeklyChart({ daily }: { daily: DailyView[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<'posts' | 'referrer'>('posts');
  const [dailyPosts, setDailyPosts] = useState<DailyPost[]>([]);
  const [dailyReferrers, setDailyReferrers] = useState<ReferrerItem[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [referrersLoading, setReferrersLoading] = useState(false);

  const chartData = daily.map((d) => ({
    date: `${parseInt(d.date.slice(5, 7))}/${parseInt(d.date.slice(8, 10))}`,
    rawDate: d.date,
    조회수: d.count,
  }));

  const fetchPosts = async (date: string) => {
    setPostsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/daily-posts?date=${date}`);
      const json = await res.json();
      if (json.success) setDailyPosts(json.posts);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchReferrers = async (date: string) => {
    setReferrersLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/referrers?date=${date}`);
      const json = await res.json();
      if (json.success) setDailyReferrers(json.referrers);
    } finally {
      setReferrersLoading(false);
    }
  };

  const handleBarClick = async (data: { rawDate: string }) => {
    if (!data?.rawDate) return;
    const date = data.rawDate;
    if (selectedDate === date) {
      setSelectedDate(null);
      setDailyPosts([]);
      setDailyReferrers([]);
      return;
    }
    setSelectedDate(date);
    setDetailView('posts');
    fetchPosts(date);
  };

  const handleDetailViewChange = (view: 'posts' | 'referrer') => {
    setDetailView(view);
    if (view === 'referrer' && selectedDate && dailyReferrers.length === 0) {
      fetchReferrers(selectedDate);
    }
  };

  const selectedDateLabel = selectedDate
    ? `${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8, 10))}일`
    : null;

  const referrerTotal = dailyReferrers.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          최근 14일 일별 조회수 — 막대를 클릭하면 해당 일의 상세 통계를 확인할 수 있습니다.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#fff',
                padding: '6px 10px',
              }}
              formatter={(value) => [`${Number(value).toLocaleString()}회`, '조회수']}
              itemStyle={{ color: '#10b981' }}
              labelStyle={{ color: '#9ca3af', marginBottom: 2 }}
              cursor={{ fill: 'rgba(0,100,0,0.05)' }}
            />
            <Bar
              dataKey="조회수"
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data as unknown as { rawDate: string })}
              shape={(props) => {
                const { x, y, width, height, index } = props as { x: number; y: number; width: number; height: number; index: number };
                const rawDate = chartData[index]?.rawDate;
                const isSelected = selectedDate === rawDate;
                const isDimmed = selectedDate && !isSelected;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={4}
                    fill={isSelected ? '#006400' : '#10b981'}
                    opacity={isDimmed ? 0.35 : 1}
                    style={{ cursor: 'pointer' }}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 폴백 UI */}
      {!selectedDate && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 px-6 py-12 flex flex-col items-center gap-2 text-center">
          <FiBarChart2 size={28} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">막대를 클릭해서 일별 통계를 확인해보세요</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">조회 글 순위와 유입경로를 날짜별로 볼 수 있습니다.</p>
        </div>
      )}

      {/* 선택된 날 상세 */}
      {selectedDate && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* 헤더: 날짜 + 탭 토글 + 닫기 */}
          <div className="px-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium dark:text-gray-200 pr-4">{selectedDateLabel}</span>
              <div className="flex">
                {(['posts', 'referrer'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => handleDetailViewChange(v)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      detailView === v
                        ? 'border-b-2 border-brand-primary text-brand-primary dark:border-brand-secondary dark:text-brand-secondary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {v === 'posts' ? '조회 글' : '유입경로'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setSelectedDate(null); setDailyPosts([]); setDailyReferrers([]); }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>

          {/* 조회 글 탭 */}
          {detailView === 'posts' && (
            postsLoading ? (
              <ul className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-3">
                    <div className="h-3.5 w-4 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
                    <div className="h-3.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3.5 w-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
                  </li>
                ))}
              </ul>
            ) : dailyPosts.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500">조회 데이터가 없습니다.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-50 dark:border-gray-800">
                  <span className="w-4 shrink-0" />
                  <span className="flex-1">제목</span>
                  <span className="w-16 shrink-0 text-right">조회수</span>
                </div>
                <ul>
                  {dailyPosts.map((post, i) => (
                    <li key={post.postId} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">{i + 1}</span>
                      <Link href={`/posts/${post.slug}`} className="flex-1 text-sm font-medium truncate dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
                        {post.title}
                      </Link>
                      <span className="text-sm font-semibold w-16 shrink-0 text-right dark:text-gray-200">{post.views.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </>
            )
          )}

          {/* 유입경로 탭 */}
          {detailView === 'referrer' && (
            referrersLoading ? (
              <ul className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 flex items-center gap-4">
                    <div className="h-3.5 w-4 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
                    <div className="h-3.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3.5 w-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
                  </li>
                ))}
              </ul>
            ) : dailyReferrers.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500">유입경로 데이터가 없습니다.</p>
            ) : (
              <>
                <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-gray-50 dark:border-gray-800">
                  <span className="w-4 shrink-0" />
                  <span className="flex-1">유입경로</span>
                  <span className="w-16 shrink-0 text-right">건수</span>
                  <span className="w-28 shrink-0 text-right">비율</span>
                </div>
                <ul>
                  {dailyReferrers.map((item, i) => {
                    const percent = referrerTotal > 0 ? (item.count / referrerTotal) * 100 : 0;
                    const isDirect = item.source === '직접 방문';
                    return (
                      <li key={item.source} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-4">
                        <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">{i + 1}</span>
                        <span className="flex-1 text-sm font-medium dark:text-gray-200 truncate flex items-center gap-1.5">
                          {isDirect ? (
                            item.source
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/10 dark:text-brand-secondary">
                              {item.source}
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-semibold w-16 shrink-0 text-right dark:text-gray-200">{item.count.toLocaleString()}</span>
                        <div className="w-28 shrink-0 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div className="h-full rounded-full bg-brand-primary dark:bg-brand-secondary" style={{ width: `${percent.toFixed(1)}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right shrink-0">{percent.toFixed(1)}%</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ─── 메인 ─── */
const AnalyticsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'all') as TabKey;

  const [allPosts, setAllPosts] = useState<PostItem[]>([]);
  const [todayPosts, setTodayPosts] = useState<PostItem[]>([]);
  const [daily, setDaily] = useState<DailyView[]>([]);
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
        } else if (tab === 'weekly') {
          const res = await fetch('/api/admin/stats/daily');
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          setDaily(data.daily);
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
    tab === 'all' ? '데이터가 없습니다.'
    : tab === 'today' ? '오늘 조회된 게시글이 없습니다.'
    : '유입경로 데이터가 없습니다.';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-3">
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
        tab === 'referrer' ? <ReferrerSkeletonList />
        : tab === 'weekly' ? <WeeklySkeletonChart />
        : <PostSkeletonList />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tab === 'weekly' ? (
        <WeeklyChart daily={daily} />
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
                        <span className="text-brand-secondary ml-1">(+{post.todayViews})</span>
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
