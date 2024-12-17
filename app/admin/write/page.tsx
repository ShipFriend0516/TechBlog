import BlogForm from '@/app/entities/post/write/BlogForm';
import axios from 'axios';
import { Post } from '@/app/types/Post';

type PostBody = Omit<Post, '_id' | 'date' | 'timeToRead' | 'comment'>;

const BlogWritePage = () => {
  const postBlog = async (post: PostBody) => {
    try {
      const response = await axios.post('/api/posts', post);
    } catch (e) {
      console.error('글 발행 중 오류 발생', e);
    }
  };

  return (
    <section className={'pt-4'}>
      <h1 className={'text-3xl text-center mb-4'}>글 작성</h1>
      <BlogForm onSubmit={postBlog} />
    </section>
  );
};

export default BlogWritePage;
