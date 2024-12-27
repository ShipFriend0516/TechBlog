import { Post } from '@/app/types/Post';
import PostPreview from '@/app/entities/post/list/PostPreview';
import profile from '@/app/public/profile.jpg';
import NotFound from '@/app/entities/common/Animation/NotFound';
import { ImSpinner2 } from 'react-icons/im';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';

const PostList = (props: {
  query: string;
  loading: boolean;
  posts: Post[] | undefined;
}) => {
  return (
    <ul
      className={
        'h-fit max-w-6xl mx-auto post-list my-4 px-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6'
      }
    >
      {props.loading ? (
        <SVGLoadingSpinner message={'발행된 글을 불러오는 중...'} />
      ) : props.posts && props.posts.length > 0 ? (
        props.posts.map(
          (post) =>
            post._id && (
              <li className={'block'} key={post._id}>
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
        <div className={'col-span-3'}>
          <NotFound
            message={`${props.query || '검색어'}에 대한 검색 결과가 없습니다.`}
          />
        </div>
      )}
    </ul>
  );
};

export default PostList;
