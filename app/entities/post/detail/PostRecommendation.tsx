'use client';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { Post } from '@/app/types/Post';
import PostRecommendationListItem from '@/app/entities/post/detail/PostRecommendationListItem';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import { FaBookmark } from 'react-icons/fa';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
interface PostRecommendationProps {
  tags: string[];
  currentPostId: string;
  seriesId: string;
}

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
  };

  const { data, loading, error } =
    useDataFetch<PostRecommendationResponse>(config);

  return (
    <div className={'max-w-3xl mx-auto mt-4 px-2'}>
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
