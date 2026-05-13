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
    <div className={'max-w-[768px] mt-4 mx-4 md:mx-auto px-2'}>
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
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 px-2.5 py-3.5 mb-1">
              <Skeleton className="w-[116px] aspect-[16/9] rounded-[10px] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex gap-1.5 mb-1.5">
                  <Skeleton className="h-[18px] w-12 rounded-full" />
                  <Skeleton className="h-[18px] w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostRecommendation;
