'use client';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import { debounce } from 'lodash';
import useSearchQueryStore from '@/app/stores/useSearchQueryStore';
import { useSearchParams } from 'next/navigation';

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const addLatestQuery = useSearchQueryStore((state) => state.addSearchQuery);
  const searchParams = useSearchParams();
  const seriesSlugParam = searchParams.get('series');
  const getPosts = async (query?: string, seriesSlug?: string | null) => {
    const response = await axios.get(`/api/posts`, {
      params: {
        query: query,
        series: seriesSlug,
      },
    });
    const data = await response.data;
    setPosts(data.posts);
    if (query) addLatestQuery(query);
    setLoading(false);
  };

  const debouncedGetPosts = useCallback(debounce(getPosts, 500), []);

  useEffect(() => {
    debouncedGetPosts(query, seriesSlugParam);
  }, [query, seriesSlugParam]);

  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <SearchSection query={query} setQuery={setQuery} />
      <PostList query={query} loading={loading} posts={posts} />
    </section>
  );
};
export default BlogList;
