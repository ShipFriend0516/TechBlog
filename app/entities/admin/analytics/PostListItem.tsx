import Link from 'next/link';
import { memo, useId, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { formatDate } from '@/app/lib/utils/format';
import { PopularPostItem, ReferrerItem } from '@/app/types/Admin';
import { fetchAdminJson, toPercent } from './fetchAnalytics';

export type PopularPostMode = 'all' | 'today';

interface PostListItemProps {
  post: PopularPostItem;
  rank: number;
  mode: PopularPostMode;
}

type ReferrerState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; referrers: ReferrerItem[] }
  | { status: 'error' };

const PostViews = ({ post, mode }: { post: PopularPostItem; mode: PopularPostMode }) =>
  mode === 'all' ? (
    <>
      {(post.totalViews ?? 0).toLocaleString()}
      {post.todayViews > 0 && (
        <span className="text-accent ml-1">(+{post.todayViews})</span>
      )}
    </>
  ) : (
    <>{post.todayViews.toLocaleString()}회</>
  );

const PostReferrers = ({ state }: { state: ReferrerState }) => {
  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="flex gap-2 animate-pulse">
        {[80, 60, 100].map((w) => (
          <div key={w} className="h-3 bg-raised rounded" style={{ width: w }} />
        ))}
      </div>
    );
  }
  if (state.status === 'error') {
    return <p className="text-xs text-danger">유입 경로를 불러오지 못했습니다.</p>;
  }
  if (state.referrers.length === 0) {
    return <p className="text-xs text-fg-muted">데이터 없음</p>;
  }

  const total = state.referrers.reduce((sum, r) => sum + r.count, 0);
  return (
    <ul className="flex flex-col gap-1.5">
      {state.referrers.map(({ source, count }) => {
        const pct = Math.round(toPercent(count, total));
        return (
          <li key={source} className="flex items-center gap-3 min-w-0">
            <span className="text-xs text-fg-muted w-36 shrink-0 truncate">
              {source}
            </span>
            <div className="flex-1 h-1.5 bg-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-fg-muted shrink-0 w-24 text-right tabular-nums">
              {count.toLocaleString()}회 ({pct}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const PostListItem = ({ post, rank, mode }: PostListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [referrerState, setReferrerState] = useState<ReferrerState>({
    status: 'idle',
  });
  const panelId = useId();

  const loadReferrers = async () => {
    setReferrerState({ status: 'loading' });
    try {
      const referrers = await fetchAdminJson(
        `/api/admin/analytics/referrers?postId=${post.postId}`,
        (data) => data.referrers as ReferrerItem[]
      );
      setReferrerState({ status: 'loaded', referrers });
    } catch {
      setReferrerState({ status: 'error' });
    }
  };

  const handleToggle = () => {
    // 최초 펼침(또는 이전 실패) 시에만 요청 — 이후에는 캐시된 결과 사용
    if (!expanded && (referrerState.status === 'idle' || referrerState.status === 'error')) {
      loadReferrers();
    }
    setExpanded((prev) => !prev);
  };

  return (
    <li className="border-b border-hairline last:border-b-0">
      <div className="px-4 py-2.5 hover:bg-raised/40 transition-colors duration-150 flex items-center gap-3 min-w-0">
        <span className="text-xs text-fg-muted w-4 shrink-0 text-right">{rank}</span>
        <Link
          href={`/posts/${post.slug}`}
          prefetch={false}
          className="flex-1 text-sm font-medium truncate hover:text-accent transition-colors min-w-0"
        >
          {post.title}
        </Link>
        <div className="w-24 shrink-0 flex justify-center min-w-0">
          {post.seriesTitle ? (
            <span
              title={post.seriesTitle}
              className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent truncate max-w-full"
            >
              {post.seriesTitle}
            </span>
          ) : (
            <span className="text-xs text-fg-faint">—</span>
          )}
        </div>
        <span className="text-xs text-fg-muted w-24 shrink-0 text-center">
          {formatDate(post.date)}
        </span>
        <span className="text-xs text-fg-muted w-12 shrink-0 text-center">
          ♥ {post.likeCount.toLocaleString()}
        </span>
        <span className="text-sm font-semibold shrink-0 w-20 text-right tabular-nums">
          <PostViews post={post} mode={mode} />
        </span>
        <button
          onClick={handleToggle}
          className="shrink-0 rounded text-fg-muted hover:text-fg-soft transition-colors p-0.5"
          aria-label="유입 경로 보기"
          aria-expanded={expanded}
          aria-controls={panelId}
        >
          <FiChevronDown
            size={14}
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded && (
        <div id={panelId} className="px-6 pb-3 pt-2 bg-raised/30 border-t border-hairline">
          <p className="text-xs text-fg-muted mb-2">유입 경로</p>
          <PostReferrers state={referrerState} />
        </div>
      )}
    </li>
  );
};

export default memo(PostListItem);
