import PostHeader from '@/app/entities/post/detail/PostHeader';
import PostBody from '@/app/entities/post/detail/PostBody';
import example2 from '@/app/public/thumbnail_example2.webp';
import Comments from '@/app/entities/comment/Comments';
import { Metadata } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import PostJSONLd from '@/app/entities/post/detail/PostJSONLd';
import PostTOC from '@/app/entities/post/detail/PostTOC';
import { FaShareAlt } from 'react-icons/fa';
import PostShareSection from '@/app/entities/post/detail/PostShareSection';

async function getPostDetail(slug: string) {
  await dbConnect();

  const post = await Post.findOne({ slug: decodeURIComponent(slug) }).lean();

  if (!post) {
    throw new Error('Post not found');
  }

  return { post: JSON.parse(JSON.stringify(post)) };
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const { post } = await getPostDetail(params.slug);
  return {
    title: post.title,
    description: post.subTitle || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.subTitle || post.content.substring(0, 160),
      images: [post.thumbnailImage || example2],
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author],
    },
    other: {
      'application-name': '사이트 이름',
      author: post.author,
      publish_date: new Date(post.date).toISOString(),
      'og:type': 'article',
      'article:tag': 'technology,programming,web development',
    },
  };
};

const PortfolioBlogUI = async ({ params }: { params: { slug: string } }) => {
  const { post } = await getPostDetail(params.slug);
  console.log(params.slug);
  return (
    <>
      <PostJSONLd post={post} />
      <section className="bg-transparent w-full flex-grow">
        <article className="post">
          <PostHeader
            title={post?.title || ''}
            subTitle={post?.subTitle || ''}
            author={post?.author || ''}
            date={post?.date || 0}
            timeToRead={post?.timeToRead || 0}
            backgroundThumbnail={post?.thumbnailImage || example2}
          />
          <PostBody loading={false} content={post?.content || ''} />
        </article>
        <PostShareSection />
        <Comments />
      </section>
    </>
  );
};

export default PortfolioBlogUI;
