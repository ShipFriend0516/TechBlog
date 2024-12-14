import PostPreview from '@/app/entities/post/PostPreview';
import profile from '@/app/public/profile.jpg';

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
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <ul className={'w-full post-list my-12 px-4'}>
        {posts.map((post) => (
          <li key={post.id}>
            <PostPreview
              title={post.title}
              subTitle={post.subTitle}
              author={post.author}
              date={post.date}
              timeToRead={post.timeToRead}
              profileImage={profile}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
export default BlogList;
