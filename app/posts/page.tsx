'use client';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import { debounce } from 'lodash';
import useSearchQueryStore from '@/app/stores/useSearchQueryStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/app/entities/common/Pagination';

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const addLatestQuery = useSearchQueryStore((state) => state.addSearchQuery);
  const router = useRouter();
  const searchParams = useSearchParams();
  const seriesSlugParam = searchParams.get('series');
  const currentPage = Number(searchParams.get('page')) || 1;
  const [totalPosts, setTotalPosts] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const getPosts = async (query?: string, seriesSlug?: string | null) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts`, {
        params: {
          query: query ? query : null,
          series: seriesSlug,
          compact: 'true',
          page: Number(searchParams.get('page')) || 1,
        },
      });
      const data = await response.data;
      setPosts(data.posts);
      setTotalPosts(data.pagination.totalPosts);
      if (query) addLatestQuery(query);
      setLoading(false);
    } catch (e) {
      console.error('Error fetching posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetSearchCondition = () => {
    setQuery('');
    router.push('/posts');
  };

  const debouncedGetPosts = useCallback(debounce(getPosts, 300), [currentPage]);

  useEffect(() => {
    debouncedGetPosts(query, seriesSlugParam);
  }, [query, seriesSlugParam, currentPage]);

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
      <Pagination
        totalItems={totalPosts}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
      />
    </section>
  );
};
export default BlogList;
