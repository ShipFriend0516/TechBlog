'use client';
import React, { useEffect, useState } from 'react';
import PostHeader from '@/app/entities/post/detail/PostHeader';
import PostBody from '@/app/entities/post/detail/PostBody';
import example2 from '@/app/public/thumbnail_example2.jpg';
import { useParams } from 'next/navigation';
import { Post } from '@/app/types/Post';
import { getPostDetail } from '@/app/entities/post/api/postAPI';
import Comments from '@/app/entities/comment/Comments';

const PortfolioBlogUI = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostDetailRequest();
  }, [postId]);

  const getPostDetailRequest = async () => {
    const data = await getPostDetail(postId as string);
    setPost(data.post);
    setLoading(false);
  };

  return (
    <section className={'bg-transparent w-full flex-grow'}>
      <article className={'post'}>
        <PostHeader
          title={post?.title || ''}
          subTitle={post?.subTitle || ''}
          author={post?.author || ''}
          date={post?.date || 0}
          timeToRead={post?.timeToRead || 0}
          backgroundThumbnail={post?.thumbnailImage || example2}
        />
        <PostBody loading={loading} content={post ? post.content : ''} />
      </article>
      <Comments />
    </section>
  );
};

export default PortfolioBlogUI;
