import { Post } from '@/app/types/Post';
import PostPreview from '@/app/entities/post/list/PostPreview';
import profile from '@/app/public/profile.jpg';
import NotFound from '@/app/entities/common/Animation/NotFound';
import PostsGridSkeleton from '@/app/entities/common/Skeleton/PostsGridSkeleton';

const PostList = (props: {
  query: string;
  loading: boolean;
  posts: Post[] | undefined;
  resetSearchCondition: () => void;
}) => {
  return (
    <ul
      className={
        'max-w-6xl mx-auto post-list my-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      }
    >
      {props.loading ? (
        <PostsGridSkeleton gridCount={12} />
      ) : props.posts && props.posts.length > 0 ? (
        props.posts.map(
          (post) =>
            post._id && (
              <li className={'block '} key={post._id}>
                <PostPreview
                  _id={post._id}
                  slug={post.slug}
                  title={post.title}
                  subTitle={post.subTitle}
                  author={post.author}
                  date={post.date}
                  timeToRead={post.timeToRead}
                  profileImage={profile}
                  thumbnailImage={post.thumbnailImage}
                />
              </li>
            )
        )
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
