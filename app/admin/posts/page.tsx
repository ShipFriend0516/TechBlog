'use client';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import ErrorState from '@/app/entities/admin/common/ErrorState';
import AdminPostListItem from '@/app/entities/admin/posts/AdminPostListItem';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import Pagination from '@/app/entities/common/Pagination';
import { deletePost } from '@/app/entities/post/api/postAPI';
import useToast from '@/app/hooks/useToast';
import { Post } from '@/app/types/Post';

const ITEMS_PER_PAGE = 8;

interface PostListResult {
  key: string;
  posts: Post[];
  totalItems: number;
  error: string | null;
}

const PostListSkeleton = () => (
  <ul className="divide-y divide-hairline animate-pulse">
    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
      <li key={i} className="px-4 py-4 flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 bg-raised rounded" />
          <div className="h-3.5 w-1/2 bg-raised rounded" />
          <div className="h-3.5 w-1/3 bg-raised rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-raised rounded-full" />
          <div className="h-8 w-8 bg-raised rounded-full" />
        </div>
      </li>
    ))}
  </ul>
);

const AdminPostListPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const currentPage = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('q') ?? '';

  const [result, setResult] = useState<PostListResult>({
    key: '',
    posts: [],
    totalItems: 0,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [searchInput, setSearchInput] = useState(query);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // 요청 키와 응답 키를 비교해 로딩 상태를 파생 — effect 안에서 동기 setState 가 필요 없다
  const requestKey = `${currentPage}|${query}|${reloadKey}`;
  const isInitialLoading = result.key === '';
  const isRefreshing = !isInitialLoading && result.key !== requestKey;

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/api/posts', {
        params: {
          compact: 'true',
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          private: 'true',
          query,
        },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setResult({
          key: requestKey,
          posts: data.posts,
          totalItems: data.pagination.totalPosts,
          error: null,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        console.error(error);
        setResult({
          key: requestKey,
          posts: [],
          totalItems: 0,
          error: '게시글을 불러오는 중 오류가 발생했습니다.',
        });
      });

    return () => controller.abort();
  }, [requestKey]);

  // 마지막 페이지의 글을 모두 삭제한 경우 이전 페이지로 이동
  useEffect(() => {
    if (isRefreshing || isInitialLoading || result.error) return;
    if (result.posts.length === 0 && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(currentPage - 1));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [result, isRefreshing, isInitialLoading, currentPage]);

  const updateQuery = (nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (nextQuery) params.set('q', nextQuery);
    else params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuery(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput('');
    updateQuery('');
  };

  // memo 된 리스트 아이템이 리렌더링되지 않도록 참조를 고정
  const handleDeleteClick = useCallback((postId: string) => {
    setDeleteTarget(postId);
  }, []);

  const handleDeleteCancel = useCallback(() => setDeleteTarget(null), []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget;
    const snapshot = result;
    setDeleteTarget(null);

    // 낙관적 업데이트 후 실패 시 롤백
    setResult((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post._id !== targetId),
      totalItems: Math.max(prev.totalItems - 1, 0),
    }));

    try {
      await deletePost(targetId);
      toast.success('삭제되었습니다.');
      // 다음 페이지의 글이 당겨져 올 수 있도록 현재 페이지를 다시 불러온다
      setReloadKey((k) => k + 1);
    } catch (error) {
      console.error(error);
      setResult(snapshot);
      toast.error('삭제에 실패했습니다.');
    }
  };

  const { posts, totalItems, error } = result;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageHeader
        title="게시글 관리"
        description={
          isInitialLoading
            ? '게시글을 불러오는 중...'
            : query
              ? `'${query}' 검색 결과 ${totalItems.toLocaleString()}개`
              : `전체 ${totalItems.toLocaleString()}개의 게시글`
        }
      />

      <form onSubmit={handleSearchSubmit} role="search" className="mb-4">
        <label className="relative block">
          <span className="sr-only">게시글 검색</span>
          <FiSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목, 부제목, 본문으로 검색 후 Enter"
            className="w-full rounded-lg bg-surface pl-9 pr-9 py-2.5 text-sm text-fg placeholder:text-fg-faint outline-none focus:ring-2 focus:ring-accent/40"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleSearchClear}
              aria-label="검색어 지우기"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted hover:text-fg"
            >
              <FiX size={14} />
            </button>
          )}
        </label>
      </form>

      <div className="rounded-xl bg-surface overflow-hidden">
        {isInitialLoading ? (
          <PostListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : posts.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-fg-muted">
            {query ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
          </p>
        ) : (
          <ul
            aria-busy={isRefreshing}
            className={`divide-y divide-hairline transition-opacity ${
              isRefreshing ? 'opacity-60' : ''
            }`}
          >
            {posts.map((post) => (
              <AdminPostListItem
                key={post._id}
                post={post}
                onDelete={handleDeleteClick}
              />
            ))}
          </ul>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {deleteTarget && (
        <DeleteModal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AdminPostListPage;
