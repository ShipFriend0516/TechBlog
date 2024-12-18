'use client';
import BlogForm from '@/app/entities/post/write/BlogForm';
import axios from 'axios';
import { Post } from '@/app/types/Post';
import { useRouter, useSearchParams } from 'next/navigation';
import useToast from '@/app/hooks/useToast';

type PostBody = Omit<Post, '_id' | 'date' | 'timeToRead' | 'comment'>;

const BlogWritePage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get('postId');
  const toast = useToast();

  const postBlog = async (post: PostBody) => {
    try {
      const response = await axios.post('/api/posts', post);
      const data = await response.data;
      console.log('글 발행 결과', data);
      if (response.status === 201) {
        toast.success('글이 성공적으로 발행되었습니다.');
        router.push('/posts');
      }
    } catch (e) {
      toast.error('글 발행 중 오류 발생했습니다.');
      console.error('글 발행 중 오류 발생', e);
    }
  };

  return (
    <section className={'pt-4'}>
      <h1 className={'text-3xl text-center mb-4'}>글 작성</h1>
      <BlogForm postBlog={postBlog} postId={postId || null} />
    </section>
  );
};

export default BlogWritePage;
