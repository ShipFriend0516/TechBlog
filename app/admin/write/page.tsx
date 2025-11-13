import { Metadata } from 'next';
import BlogForm from '@/app/entities/post/write/BlogForm';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: '글쓰기',
  };
};

const BlogWritePage = () => {
  return (
    <section className={'p-6 max-w-7xl mx-auto'}>
      <BlogForm />
    </section>
  );
};

export default BlogWritePage;
