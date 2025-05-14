'use client';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { Post } from '@/app/types/Post';
import Image from 'next/image';

import PostRecommendationListItem from '@/app/entities/post/detail/PostRecommendationListItem';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import { CiBookmark } from 'react-icons/ci';
import { FaBookmark } from 'react-icons/fa';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
interface PostRecommendationProps {
  tags: string[];
  currentPostId: string;
  seriesId: string;
}

// 포스트 추천 설계하기
// 1. 추천 포스트를 가져오는 API를 만들어야 한다.
// 태그를 전달해서 추천 글 3개를 가져오는 API를 만들지 아니면 기존 get 메서드를 활용해서 tag 검색 후 최근 3개 포스트를 가져오는게 좋을지

interface PostRecommendationResponse {
  posts: Post[];
}

const PostRecommendation = ({
  tags,
  currentPostId,
  seriesId,
}: PostRecommendationProps) => {
  const config: useDataFetchConfig = {
    url: '/api/posts/recommendation',
    method: 'GET',
    config: {
      params: {
        tags: tags,
        currentPostId: currentPostId,
        seriesId: seriesId,
      },
    },
    // dependencies: [tags],
  };

  const { data, loading, error } =
    useDataFetch<PostRecommendationResponse>(config);

  console.log(data);

  return (
    <div className={'max-w-3xl mx-auto mt-4'}>
      <div className={'inline-flex items-center gap-2 text-xl font-bold mb-2'}>
        <FaBookmark />
        추천 글
      </div>

      <ErrorBox error={error} />
      {!loading && data && data.posts.length > 0 ? (
        <ul>
          {data.posts.map((post) => (
            <PostRecommendationListItem
              slug={post.slug}
              title={post.title}
              date={post.date}
              timeToRead={post.timeToRead}
              thumbnailImage={post.thumbnailImage || ''}
              key={post._id}
              tags={post.tags || []}
            />
          ))}
        </ul>
      ) : (
        <div>
          <Skeleton className={'w-full h-24 mb-4 mx-auto'}></Skeleton>
          <Skeleton className={'w-full h-24 mb-4 mx-auto'}></Skeleton>
          <Skeleton className={'w-full h-24 mb-4 mx-auto'}></Skeleton>
        </div>
      )}
    </div>
  );
};

export default PostRecommendation;
