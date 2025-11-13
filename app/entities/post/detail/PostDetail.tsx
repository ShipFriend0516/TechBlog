import PostBody from '@/app/entities/post/detail/PostBody';
import PostHeader from '@/app/entities/post/detail/PostHeader';
import { Post as PostType } from '@/app/types/Post';

interface PostArticleProps {
  post: PostType;
  isAdmin?: boolean;
}

const PostDetail = ({ post, isAdmin = false }: PostArticleProps) => {
  const defaultThumbnail = '/images/placeholder/thumbnail_example2.webp';
  return (
    <article className="post">
      <PostHeader
        title={post?.title || ''}
        subTitle={post?.subTitle || ''}
        slug={post?.slug || ''}
        author={post?.author || ''}
        date={post?.date || 0}
        timeToRead={post?.timeToRead || 0}
        backgroundThumbnail={post?.thumbnailImage || defaultThumbnail}
        isAdmin={isAdmin}
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
