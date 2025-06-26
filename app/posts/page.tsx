'use client';
import { useMemo, useState } from 'react';
import { Post } from '@/app/types/Post';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/app/entities/common/Pagination';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import ErrorBox from '../entities/common/Error/ErrorBox';
import useURLSync from '@/app/hooks/common/useURLSync';
import usePostSearch from '@/app/hooks/post/usePostSearch';
import useToast from '@/app/hooks/useToast';

interface PaginationData {
  totalPosts: number;
}

const BlogList = () => {
  const { query, debouncedQuery, setQuery, addLatestQuery } = usePostSearch();

  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seriesSlugParam = searchParams.get('series');
  const currentPage = Number(searchParams.get('page')) || 1;

  const [totalPosts, setTotalPosts] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const config = useMemo((): useDataFetchConfig => {
    return {
      url: `/api/posts`,
      method: 'GET' as const,
      config: {
        params: {
          query: debouncedQuery ? debouncedQuery.trim() : null,
          series: seriesSlugParam,
          compact: 'true',
          page: Number(searchParams.get('page')) || 1,
        },
      },
      onBeforeFetch: () => {
        if (debouncedQuery) {
          addLatestQuery(debouncedQuery.trim());
        }
      },
      onSuccess: (data: { posts: Post[]; pagination: PaginationData }) => {
        setTotalPosts(data?.pagination.totalPosts);
      },
      dependencies: [debouncedQuery, seriesSlugParam, currentPage],
    };
  }, [debouncedQuery, seriesSlugParam, currentPage]);

  const { data, loading, error } = useDataFetch<{
    posts: Post[];
    pagination: PaginationData;
  }>(config);

  const posts = data?.posts || [];

  useURLSync({
    baseURL: 'posts',
    params: {
      page: currentPage,
      series: seriesSlugParam,
      query: query,
    },
  });

  if (error) {
    console.error('Error fetching posts:', error);
    toast.error('서버에 오류가 발생해 글을 불러올 수 없습니다.');
  }

  const resetSearchCondition = () => {
    setQuery('');
    router.push('/posts');
  };

  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <SearchSection
        query={query}
        setQuery={setQuery}
        resetSearchCondition={resetSearchCondition}
        searchSeries={seriesSlugParam || ''}
      />
      <PostList
        query={query}
        loading={loading}
        posts={posts}
        resetSearchCondition={resetSearchCondition}
      />
      <ErrorBox error={error} />
      <Pagination
        totalItems={totalPosts}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
      />
    </section>
  );
};
export default BlogList;
