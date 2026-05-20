'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/app/entities/common/Pagination';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import useDebounce from '@/app/hooks/optimize/useDebounce';
import searchQueryStore from '@/app/stores/useSearchQueryStore';
import { Post } from '@/app/types/Post.d';
import { Series } from '@/app/types/Series.d';

interface PostSearchClientProps {
  initialQuery: string;
  series: Series[];
  searchSeries: string;
  searchTag: string;
  initialPosts: Post[];
  totalPosts: number;
  currentPage: number;
  itemsPerPage: number;
}

const PostSearchClient = ({
  initialQuery,
  series,
  searchSeries,
  searchTag,
  initialPosts,
  totalPosts,
  currentPage,
  itemsPerPage,
}: PostSearchClientProps) => {
  const router = useRouter();
  const addLatestQuery = searchQueryStore((state) => state.addSearchQuery);

  const [query, setQuery] = useState(initialQuery);
  // 클라이언트 검색 결과 (null이면 서버 props 사용)
  const [clientData, setClientData] = useState<{
    posts: Post[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // 마운트 여부 추적 (초기 렌더에서 불필요한 API 호출 방지)
  const isMounted = useRef(false);

  const debouncedQuery = useDebounce(query, 300);

  // 검색어가 있고 결과가 있을 때만 클라이언트 데이터 사용, 아니면 서버 props 사용
  const posts = debouncedQuery && clientData ? clientData.posts : initialPosts;
  const total = debouncedQuery && clientData ? clientData.total : totalPosts;

  // debouncedQuery 변경 시 클라이언트 리패치
  useEffect(() => {
    const getPosts = async (page: number) => {
      setLoading(true);
      try {
        const response = await axios.get('/api/posts', {
          params: {
            query: debouncedQuery,
            series: searchSeries || null,
            tag: searchTag || null,
            page: 1, // 검색어 변경 시 1페이지로 초기화
            compact: 'true',
          },
        });

        const newPosts = response.data.posts || [];
        const newTotal = response.data.pagination?.totalPosts || 0;

        setClientData({
          posts: newPosts,
          total: newTotal,
        });

        // 페이지네이션이 query를 포함한 URL을 만들 수 있도록 URL에 동기화
        const params = new URLSearchParams(window.location.search);
        params.set('query', debouncedQuery);
        params.set('page', '1');
        router.replace(`/posts?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error('페이지 이동 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    // 최초 마운트에서는 서버에서 이미 데이터를 받았으므로 API 호출 skip
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!debouncedQuery) {
      // 검색어가 지워지면 URL에서 query 파라미터 제거
      const params = new URLSearchParams(window.location.search);
      if (params.has('query')) {
        params.delete('query');
        params.delete('page');
        router.replace(params.toString() ? `/posts?${params.toString()}` : '/posts', { scroll: false });
      }
      return;
    }

    addLatestQuery(debouncedQuery.trim());
    getPosts(1);
  }, [debouncedQuery, searchSeries, searchTag]);

  const handleResetSearchCondition = () => {
    setQuery('');
    router.push('/posts');
  };

  return (
    <>
      <SearchSection
        query={query}
        setQuery={setQuery}
        resetSearchCondition={handleResetSearchCondition}
        searchSeries={searchSeries}
        searchTag={searchTag}
        series={series}
      />
      <PostList
        query={query}
        loading={loading}
        posts={posts}
        resetSearchCondition={handleResetSearchCondition}
      />
      <Pagination
        totalItems={total}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default PostSearchClient;
