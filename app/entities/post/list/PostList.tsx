'use client';

import NotFound from '@/app/entities/common/Animation/NotFound';
import PostsGridSkeleton from '@/app/entities/common/Skeleton/PostsGridSkeleton';
import PostPreview from '@/app/entities/post/list/PostPreview';
import useGridColumns from '@/app/hooks/common/useGridColumns';
import { Post } from '@/app/types/Post';

const PostList = (props: {
  query: string;
  loading: boolean;
  posts: Post[] | undefined;
  resetSearchCondition: () => void;
}) => {
  const cols = useGridColumns();

  return (
    <ul
      className={
        'max-w-6xl mx-auto post-list my-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      }
    >
      {props.loading ? (
        <PostsGridSkeleton gridCount={12} />
      ) : props.posts && props.posts.length > 0 ? (
        props.posts.map((post, index) => {
          if (!post._id) return null;

          const row = Math.floor(index / cols);
          const col = index % cols;
          const diagonalIndex = row + col;
          const delay = diagonalIndex * 0.1;

          return (
            <li
              className={'block opacity-0 translate-y-5 animate-popUp'}
              key={post._id}
              style={{
                animationDelay: `${delay}s`,
                animationFillMode: 'forwards',
              }}
            >
              <PostPreview
                _id={post._id}
                slug={post.slug}
                title={post.title}
                subTitle={post.subTitle}
                author={post.author}
                date={post.date}
                timeToRead={post.timeToRead}
                profileImage={'/images/profile/profile.jpg'}
                thumbnailImage={post.thumbnailImage}
              />
            </li>
          );
        })
      ) : (
        <div className={'flex flex-col gap-4 col-span-4'}>
          <NotFound
            message={`${props.query || '검색어'}에 대한 검색 결과가 없습니다.`}
          />
          <button
            onClick={props.resetSearchCondition}
            className={
              'bg-neutral-500 text-white hover:bg-gray-600 px-4 py-1 rounded mx-auto'
            }
          >
            검색 초기화하기
          </button>
        </div>
      )}
    </ul>
  );
};

export default PostList;
