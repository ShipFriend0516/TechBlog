import { Metadata } from 'next';
import BlogForm from '@/app/entities/post/write/BlogForm';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Write a New Post',
  };
};

const BlogWritePage = () => {
  return (
    <section className={'px-4 pt-6 max-w-7xl mx-auto'}>
      <BlogForm />
    </section>
  );
};

export default BlogWritePage;
