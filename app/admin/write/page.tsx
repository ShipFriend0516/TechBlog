'use client';
import BlogForm from '@/app/entities/post/write/BlogForm';
import axios from 'axios';
import { Post } from '@/app/types/Post';
import { useRouter } from 'next/navigation';

type PostBody = Omit<Post, '_id' | 'date' | 'timeToRead' | 'comment'>;

const BlogWritePage = () => {
  const router = useRouter();
  const postBlog = async (post: PostBody) => {
    try {
      const response = await axios.post('/api/posts', post);
      const data = await response.data;
      console.log('글 발행 결과', data);
      if (response.status === 201) {
        router.push('/posts');
      }
    } catch (e) {
      console.error('글 발행 중 오류 발생', e);
    }
  };

  return (
    <section className={'pt-4'}>
      <h1 className={'text-3xl text-center mb-4'}>글 작성</h1>
      <BlogForm postBlog={postBlog} />
    </section>
  );
};

export default BlogWritePage;
