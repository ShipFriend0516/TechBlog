'use client';
import PostPreview from '@/app/entities/post/PostPreview';
import profile from '@/app/public/profile.jpg';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post } from '@/app/types/Post';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';

const BlogList = () => {
  // const posts = [
  //   {
  //     id: 1,
  //     title: '개인 프로젝트를 성공하는 3가지 방법',
  //     subTitle: 'with Claude AI Opus',
  //     author: 'Jeongwoo',
  //     date: 1727623777444,
  //     timeToRead: 3,
  //   },
  //   {
  //     id: 2,
  //     title: '개인 프로젝트를 성공하는 3가지 방법',
  //     subTitle: 'with Claude AI Sonnet',
  //     author: 'Jeongwoo',
  //     date: 1727623177444,
  //     timeToRead: 3,
  //   },
  // ];

  const [posts, setPosts] = useState<Post[]>();
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    const response = await axios.get('/api/posts');
    const data = await response.data;
    setPosts(data.posts);
    console.log(data.posts);
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <section>
      <h1 className={'text-4xl text-center font-bold mt-8'}>발행된 글</h1>
      <ul className={'w-full post-list my-12 px-4'}>
        {loading ? (
          <div className={'mx-auto w-1/3 h-full pt-20'}>
            <LoadingIndicator message={'블로그를 로딩 중입니다..'} />
          </div>
        ) : (
          posts &&
          posts.map(
            (post) =>
              post._id && (
                <li key={post._id}>
                  <PostPreview
                    title={post.title}
                    subTitle={post.subTitle}
                    author={post.author}
                    date={post.date}
                    timeToRead={post.timeToRead}
                    profileImage={profile}
                  />
                </li>
              )
          )
        )}
      </ul>
    </section>
  );
};
export default BlogList;
