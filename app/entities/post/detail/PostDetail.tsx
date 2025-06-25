import { Post as PostType } from '@/app/types/Post';
import PostHeader from '@/app/entities/post/detail/PostHeader';
import PostBody from '@/app/entities/post/detail/PostBody';

interface PostArticleProps {
  post: PostType;
}

const PostDetail = ({ post }: PostArticleProps) => {
  const defaultThumbnail = '/images/placeholder/thumbnail_example2.webp';
  return (
    <article className="post">
      <PostHeader
        title={post?.title || ''}
        subTitle={post?.subTitle || ''}
        author={post?.author || ''}
        date={post?.date || 0}
        timeToRead={post?.timeToRead || 0}
        backgroundThumbnail={post?.thumbnailImage || defaultThumbnail}
      />
      <PostBody
        loading={false}
        tags={post?.tags || []}
        content={post?.content || ''}
      />
    </article>
  );
};

export default PostDetail;
