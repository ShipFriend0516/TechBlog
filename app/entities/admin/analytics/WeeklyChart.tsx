'use client';

import Link from 'next/link';
import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { FiBarChart2, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatKoreanMonthDay, formatShortDate } from '@/app/lib/utils/format';
import { DailyPost, DailyView, ReferrerItem } from '@/app/types/Admin';
import { DetailRowsSkeleton } from './AnalyticsSkeletons';
import { fetchAdminJson } from './fetchAnalytics';
import ReferrerTable from './ReferrerTable';

type DetailView = 'posts' | 'referrer';

const DETAIL_TABS: { key: DetailView; label: string }[] = [
  { key: 'posts', label: '조회 글' },
  { key: 'referrer', label: '유입경로' },
];

// 날짜별 요청 결과 캐시 — undefined: 미요청, 'loading' | 'error' | 데이터
type Loadable<T> = 'loading' | 'error' | T;
type DateCache<T> = Record<string, Loadable<T> | undefined>;

const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: 'rgb(var(--overlay))',
  border: 'none',
  borderRadius: '6px',
  fontSize: '12px',
  color: 'rgb(var(--fg))',
  padding: '6px 10px',
};
const AXIS_TICK = { fontSize: 11, fill: 'rgb(var(--fg-muted))' };
const CHART_MARGIN = { top: 4, right: 8, left: -16, bottom: 0 };

/**
 * 날짜 단위 요청을 캐싱하는 훅.
 * 응답을 날짜 키로 저장하므로 빠르게 다른 날짜를 눌러도 이전 응답이 섞이지 않는다.
 */
const useDateCache = <T,>(buildUrl: (date: string) => string, pick: (data: Record<string, unknown>) => T) => {
  const [cache, setCache] = useState<DateCache<T>>({});

  const load = useCallback(
    async (date: string, force = false) => {
      if (!force && cache[date] !== undefined && cache[date] !== 'error') return;
      setCache((prev) => ({ ...prev, [date]: 'loading' }));
      try {
        const result = await fetchAdminJson(buildUrl(date), pick);
        setCache((prev) => ({ ...prev, [date]: result }));
      } catch {
        setCache((prev) => ({ ...prev, [date]: 'error' }));
      }
    },
    [cache]
  );

  return [cache, load] as const;
};

const DetailContent = <T extends unknown[]>({
  value,
  emptyMessage,
  skeletonCells,
  onRetry,
  children,
}: {
  value: Loadable<T> | undefined;
  emptyMessage: string;
  skeletonCells: string[];
  onRetry: () => void;
  children: (data: T) => ReactNode;
}) => {
  if (value === undefined || value === 'loading') {
    return <DetailRowsSkeleton cells={skeletonCells} />;
  }
  if (value === 'error') {
    return (
      <p className="px-4 py-6 text-sm text-danger">
        데이터를 불러오지 못했습니다.{' '}
        <button onClick={onRetry} className="underline hover:no-underline">
          다시 시도
        </button>
      </p>
    );
  }
  if (value.length === 0) {
    return <p className="px-4 py-6 text-sm text-fg-muted">{emptyMessage}</p>;
  }
  return <>{children(value)}</>;
};

const pickPosts = (data: Record<string, unknown>) => data.posts as DailyPost[];
const pickReferrers = (data: Record<string, unknown>) => data.referrers as ReferrerItem[];
const postsUrl = (date: string) => `/api/admin/analytics/daily-posts?date=${date}`;
const referrersUrl = (date: string) => `/api/admin/analytics/referrers?date=${date}`;

const WeeklyChart = ({ daily }: { daily: DailyView[] }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<DetailView>('posts');
  const [postsByDate, loadPosts] = useDateCache(postsUrl, pickPosts);
  const [referrersByDate, loadReferrers] = useDateCache(referrersUrl, pickReferrers);

  const chartData = useMemo(
    () =>
      daily.map((d) => ({
        date: formatShortDate(d.date),
        rawDate: d.date,
        조회수: d.count,
      })),
    [daily]
  );

  const selectedIndex = selectedDate
    ? daily.findIndex((d) => d.date === selectedDate)
    : -1;

  const selectDate = (date: string | null, view: DetailView = detailView) => {
    setSelectedDate(date);
    if (!date) return;
    // 현재 보고 있는 상세 탭의 데이터만 요청
    if (view === 'posts') loadPosts(date);
    else loadReferrers(date);
  };

  const handleBarClick = (data: { rawDate?: string } | undefined) => {
    const date = data?.rawDate;
    if (!date) return;
    selectDate(selectedDate === date ? null : date);
  };

  const handleDetailViewChange = (view: DetailView) => {
    setDetailView(view);
    if (selectedDate) selectDate(selectedDate, view);
  };

  const moveSelection = (offset: number) => {
    const next = daily[selectedIndex + offset];
    if (next) selectDate(next.date);
  };

  const handleRetry = () => {
    if (!selectedDate) return;
    if (detailView === 'posts') loadPosts(selectedDate, true);
    else loadReferrers(selectedDate, true);
  };

  // 선택 상태가 바뀔 때만 막대 렌더러를 새로 만든다
  const renderBar = useCallback(
    (props: unknown) => {
      const { x, y, width, height, index } = props as {
        x: number;
        y: number;
        width: number;
        height: number;
        index: number;
      };
      const rawDate = chartData[index]?.rawDate;
      const isSelected = selectedDate === rawDate;
      const isDimmed = selectedDate !== null && !isSelected;
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          fill={isSelected ? 'rgb(var(--nebula))' : 'rgb(var(--accent))'}
          opacity={isDimmed ? 0.35 : 1}
          style={{ cursor: 'pointer' }}
        />
      );
    },
    [chartData, selectedDate]
  );

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-xl p-6">
        <p className="text-xs text-fg-muted mb-4">
          최근 14일 일별 조회수 — 막대를 클릭하면 해당 일의 상세 통계를 확인할 수
          있습니다.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={CHART_MARGIN}>
            <CartesianGrid
              strokeDasharray="3"
              stroke="rgb(var(--fg) / 0.08)"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis dataKey="date" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_CONTENT_STYLE}
              formatter={(value) => [`${Number(value).toLocaleString()}회`, '조회수']}
              itemStyle={{ color: 'rgb(var(--accent))' }}
              labelStyle={{ color: 'rgb(var(--fg-muted))', marginBottom: 2 }}
              cursor={{ fill: 'rgb(var(--accent) / 0.05)' }}
            />
            <Bar
              dataKey="조회수"
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data as unknown as { rawDate?: string })}
              shape={renderBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!selectedDate ? (
        <div className="bg-surface rounded-xl px-6 py-12 flex flex-col items-center gap-2 text-center">
          <FiBarChart2 size={28} className="text-fg-faint" />
          <p className="text-sm font-medium text-fg-soft">
            막대를 클릭해서 일별 통계를 확인해보세요
          </p>
          <p className="text-xs text-fg-muted">
            조회 글 순위와 유입경로를 날짜별로 볼 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="px-2 sm:px-4 border-b border-hairline flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <div className="flex items-center pr-2 sm:pr-4">
                <button
                  onClick={() => moveSelection(-1)}
                  disabled={selectedIndex <= 0}
                  aria-label="이전 날짜"
                  className="rounded p-1 text-fg-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium whitespace-nowrap px-1">
                  {formatKoreanMonthDay(selectedDate)}
                </span>
                <button
                  onClick={() => moveSelection(1)}
                  disabled={selectedIndex >= daily.length - 1}
                  aria-label="다음 날짜"
                  className="rounded p-1 text-fg-muted hover:text-fg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
              <div role="tablist" className="flex">
                {DETAIL_TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={detailView === key}
                    onClick={() => handleDetailViewChange(key)}
                    className={`px-3 sm:px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      detailView === key
                        ? 'border-accent/40 text-accent'
                        : 'border-transparent text-fg-muted hover:text-fg'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              aria-label="상세 닫기"
              className="rounded p-1 text-fg-muted hover:text-fg-soft transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>

          {detailView === 'posts' ? (
            <DetailContent
              value={postsByDate[selectedDate]}
              emptyMessage="조회 데이터가 없습니다."
              skeletonCells={['h-3.5 w-12']}
              onRetry={handleRetry}
            >
              {(posts) => (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-fg-muted border-b border-hairline">
                    <span className="w-4 shrink-0" />
                    <span className="flex-1">제목</span>
                    <span className="w-16 shrink-0 text-right">조회수</span>
                  </div>
                  <ul>
                    {posts.map((post, i) => (
                      <li
                        key={post.postId}
                        className="px-4 py-2.5 border-b border-hairline last:border-b-0 hover:bg-raised/40 transition-colors duration-150 flex items-center gap-3"
                      >
                        <span className="text-xs text-fg-muted w-4 shrink-0 text-right">
                          {i + 1}
                        </span>
                        <Link
                          href={`/posts/${post.slug}`}
                          prefetch={false}
                          className="flex-1 min-w-0 text-sm font-medium truncate hover:text-accent transition-colors"
                        >
                          {post.title}
                        </Link>
                        <span className="text-sm font-semibold w-16 shrink-0 text-right tabular-nums">
                          {post.views.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </DetailContent>
          ) : (
            <DetailContent
              value={referrersByDate[selectedDate]}
              emptyMessage="유입경로 데이터가 없습니다."
              skeletonCells={['h-3.5 w-12', 'h-2 w-24 rounded-full']}
              onRetry={handleRetry}
            >
              {(referrers) => <ReferrerTable referrers={referrers} standalone={false} />}
            </DetailContent>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(WeeklyChart);
