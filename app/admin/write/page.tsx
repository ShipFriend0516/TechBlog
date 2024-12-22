import BlogForm from '@/app/entities/post/write/BlogForm';

const BlogWritePage = () => {
  return (
    <section className={'pt-4'}>
      <h1 className={'text-3xl text-center mb-4'}>글 작성</h1>
      <BlogForm />
    </section>
  );
};

export default BlogWritePage;
