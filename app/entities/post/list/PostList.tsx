import { Post } from '@/app/types/Post';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import PostPreview from '@/app/entities/post/list/PostPreview';
import profile from '@/app/public/profile.jpg';

const PostList = (props: { loading: boolean; posts: Post[] | undefined }) => {
  return (
    <ul className={'w-full post-list my-12 px-4'}>
      {props.loading ? (
        <div className={'mx-auto w-1/3 h-full pt-20'}>
          <LoadingIndicator message={'발행된 글을 로딩 중입니다..'} />
        </div>
      ) : (
        props.posts &&
        props.posts.map(
          (post) =>
            post._id && (
              <li key={post._id}>
                <PostPreview
                  _id={post._id}
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
  );
};

export default PostList;
