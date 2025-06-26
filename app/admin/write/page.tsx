import BlogForm from '@/app/entities/post/write/BlogForm';
import { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: '글쓰기',
  };
};

const BlogWritePage = () => {
  return (
    <section className={'p-6 max-w-7xl mx-auto'}>
      <h1 className={'text-2xl text-center mb-4'}>글 작성</h1>
      <BlogForm />
    </section>
  );
};

export default BlogWritePage;
