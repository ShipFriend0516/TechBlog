'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import { debounce } from 'lodash';

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const getPosts = async (query?: string) => {
    const response = await axios.get(
      `/api/posts${query ? `?query=${query}` : ''}`
    );
    const data = await response.data;
    setPosts(data.posts);
    setLoading(false);
  };

  const debouncedGetPosts = debounce(getPosts, 500);

  useEffect(() => {
    debouncedGetPosts(query);
  }, [query]);

  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <SearchSection query={query} setQuery={setQuery} />
      <PostList query={query} loading={loading} posts={posts} />
    </section>
  );
};
export default BlogList;
