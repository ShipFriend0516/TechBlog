'use client';

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import IssueCard from '@/app/entities/admin/comments/IssueCard';
import { extractPostTitle } from '@/app/entities/admin/comments/issueTitle';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import ErrorState from '@/app/entities/admin/common/ErrorState';
import { IssueWithComments } from '@/app/types/Admin';

// 이슈의 가장 최근 댓글 시각 (정렬 기준)
const getLatestCommentTime = ({ issue, comments }: IssueWithComments) =>
  comments.reduce(
    (latest, comment) => Math.max(latest, new Date(comment.created_at).getTime()),
    new Date(issue.updated_at).getTime()
  );

const loadComments = async (signal: AbortSignal): Promise<IssueWithComments[]> => {
  const response = await fetch('/api/admin/comments', { signal });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || '댓글을 불러올 수 없습니다.');
  }
  return data.data;
};

const CommentsSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-lg bg-surface p-6">
        <div className="h-6 w-1/2 bg-raised rounded mb-3" />
        <div className="h-4 w-1/3 bg-raised rounded" />
      </div>
    ))}
  </div>
);

const AdminCommentsPage = () => {
  const [issuesWithComments, setIssuesWithComments] = useState<
    IssueWithComments[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  // 입력 중에는 리스트 필터링을 낮은 우선순위로 처리해 타이핑이 끊기지 않도록 한다
  const deferredKeyword = useDeferredValue(keyword);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadComments(controller.signal)
      .then((data) => {
        setIssuesWithComments(data);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : '댓글을 불러오는 중 오류가 발생했습니다.'
        );
        console.error(err);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
        setRefreshing(false);
      });
    return () => controller.abort();
  }, [reloadToken]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setReloadToken((token) => token + 1);
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  // 최근 댓글 순 정렬은 데이터가 바뀔 때만 수행
  const sortedIssues = useMemo(
    () =>
      issuesWithComments
        .map((item) => ({ item, latest: getLatestCommentTime(item) }))
        .sort((a, b) => b.latest - a.latest)
        .map(({ item }) => item),
    [issuesWithComments]
  );

  const filteredIssues = useMemo(() => {
    const normalized = deferredKeyword.trim().toLowerCase();
    if (!normalized) return sortedIssues;
    return sortedIssues.filter(({ issue, comments }) => {
      if (extractPostTitle(issue.title).toLowerCase().includes(normalized)) {
        return true;
      }
      return comments.some(
        (comment) =>
          comment.body.toLowerCase().includes(normalized) ||
          comment.user.login.toLowerCase().includes(normalized)
      );
    });
  }, [sortedIssues, deferredKeyword]);

  const totalComments = useMemo(
    () =>
      issuesWithComments.reduce((sum, { comments }) => sum + comments.length, 0),
    [issuesWithComments]
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageHeader
        title="댓글 관리"
        description={
          loading
            ? 'Giscus(GitHub Issues) 댓글을 불러오는 중...'
            : `${issuesWithComments.length}개의 글에 총 ${totalComments}개의 댓글`
        }
        actions={
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-2 text-sm font-medium text-fg hover:bg-raised/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            새로고침
          </button>
        }
      />

      {loading ? (
        <CommentsSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : issuesWithComments.length === 0 ? (
        <div className="bg-surface rounded-lg p-8 text-center">
          <p className="text-fg-muted text-lg">아직 댓글이 없습니다.</p>
        </div>
      ) : (
        <>
          <label className="relative mb-4 block">
            <span className="sr-only">댓글 검색</span>
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
            />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="글 제목, 댓글 내용, 작성자로 필터링"
              className="w-full rounded-lg bg-surface pl-9 pr-3 py-2.5 text-sm text-fg placeholder:text-fg-faint outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          {filteredIssues.length === 0 ? (
            <p className="py-10 text-center text-sm text-fg-muted">
              조건에 맞는 댓글이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map(({ issue, comments }) => (
                <IssueCard key={issue.id} issue={issue} comments={comments} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCommentsPage;
