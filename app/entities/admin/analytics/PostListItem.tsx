import Link from 'next/link';
import { useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
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

interface Referrer {
  source: string;
  count: number;
}

const PostListItem = ({
  post,
  rank,
  viewsNode,
}: {
  post: PostItem;
  rank: number;
  viewsNode: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [referrers, setReferrers] = useState<Referrer[] | null>(null);
  const [loadingRef, setLoadingRef] = useState(false);

  const handleToggle = async () => {
    if (!expanded && referrers === null) {
      setLoadingRef(true);
      try {
        const res = await fetch(
          `/api/admin/analytics/referrers?postId=${post.postId}`
        );
        const data = await res.json();
        if (data.success) setReferrers(data.referrers);
      } catch {
        setReferrers([]);
      } finally {
        setLoadingRef(false);
      }
    }
    setExpanded((prev) => !prev);
  };

  const total = referrers?.reduce((sum, r) => sum + r.count, 0) ?? 0;

  return (
    <li className="border-b border-gray-50 dark:border-gray-800 last:border-b-0">
      {/* 메인 행 */}
      <div className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 flex items-center gap-3 min-w-0">
        <span className="text-xs text-gray-400 dark:text-gray-500 w-4 shrink-0 text-right">
          {rank}
        </span>
        <Link
          href={`/posts/${post.slug}`}
          className="flex-1 text-sm font-medium truncate dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors min-w-0"
        >
          {post.title}
        </Link>
        <div className="shrink-0 flex justify-center">
          {post.seriesTitle ? (
            <span className="text-xs px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary dark:bg-brand-secondary/10 dark:text-brand-secondary whitespace-nowrap text-nowrap max-w-full">
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
        <button
          onClick={handleToggle}
          className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5"
          aria-label="유입 경로 보기"
        >
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
      </div>

      {/* 드롭다운: 유입 경로 */}
      {expanded && (
        <div className="px-6 pb-3 pt-1 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            유입 경로
          </p>
          {loadingRef ? (
            <div className="flex gap-2 animate-pulse">
              {[80, 60, 100].map((w, i) => (
                <div
                  key={i}
                  className={`h-3 bg-gray-200 dark:bg-gray-700 rounded`}
                  style={{ width: w }}
                />
              ))}
            </div>
          ) : !referrers || referrers.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              데이터 없음
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {referrers.map(({ source, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <li key={source} className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-36 shrink-0 truncate">
                      {source}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-16 text-right">
                      {count.toLocaleString()}회 ({pct}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default PostListItem;
