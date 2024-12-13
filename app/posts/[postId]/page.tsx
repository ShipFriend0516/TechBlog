'use client';
import React, { useEffect, useState } from 'react';
import PostHeader from '@/app/entities/post/PostHeader';
import PostBody from '@/app/entities/post/PostBody';
import example2 from '@/app/public/thumbnail_example2.jpg';
import { posts } from '@/app/constants/posts';
import { useParams } from 'next/navigation';
import { Post } from '@/app/types/Post';

const PortfolioBlogUI = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);

  console.log(posts);

  useEffect(() => {
    setPost(posts.find((post: Post) => post.id === postId));
    setLoading(false);
    console.log(post);
  }, [posts, postId]);

  return (
    <section className={'bg-transparent w-full flex-grow'}>
      <article className={'post'}>
        <PostHeader
          title={'개인 프로젝트를 성공하는 3가지 방법'}
          subTitle={'with Claude AI'}
          author={'Jeongwoo'}
          date={new Date().getTime()}
          timeToRead={3}
          backgroundThumbnail={example2}
        />
        <PostBody loading={loading} content={post ? post.content : ''} />
      </article>
      <footer></footer>
    </section>
  );
};

export default PortfolioBlogUI;
