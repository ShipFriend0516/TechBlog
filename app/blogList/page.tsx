import Image from 'next/image';
import Profile from '@/app/entities/common/Profile';
import Timestamp from '@/app/entities/common/Timestamp';
import example from '@/app/public/thumbnail_example2.jpg';
import PostPreview from '@/app/entities/post/PostPreview';

const BlogList = () => {
  const posts = [
    {
      id: 1,
      title: '개인 프로젝트를 성공하는 3가지 방법',
      subTitle: 'with Claude AI Opus',
      author: 'Jeongwoo',
      date: 1727623777444,
      timeToRead: 3,
    },
    {
      id: 2,
      title: '개인 프로젝트를 성공하는 3가지 방법',
      subTitle: 'with Claude AI Sonnet',
      author: 'Jeongwoo',
      date: 1727623177444,
      timeToRead: 3,
    },
  ];
  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>Post List</h1>
      <ul className={'post-list my-12'}>
        {posts.map((post) => (
          <li key={post.id}>
            <PostPreview
              title={post.title}
              subTitle={post.subTitle}
              author={post.author}
              date={post.date}
              timeToRead={post.timeToRead}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
export default BlogList;
