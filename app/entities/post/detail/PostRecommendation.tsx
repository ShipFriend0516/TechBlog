'use client';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
import PostRecommendationListItem from '@/app/entities/post/detail/PostRecommendationListItem';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { Post } from '@/app/types/Post';
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
    <div className={'max-w-[768px] mx-auto mt-4  '}>
      <div className="text-[13px] font-bold tracking-[0.12em] uppercase text-neutral-500">
        You might also like
      </div>
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-1 mb-[18px]">
        이런 글은 어떠세요?
      </h2>

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
          <Skeleton className={'w-full h-[94px] mb-1 mx-auto'}></Skeleton>
          <Skeleton className={'w-full h-[94px] mb-1 mx-auto'}></Skeleton>
          <Skeleton className={'w-full h-[94px] mb-1 mx-auto'}></Skeleton>
        </div>
      )}
    </div>
  );
};

export default PostRecommendation;
