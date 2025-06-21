import PostHeader from '@/app/entities/post/detail/PostHeader';
import PostBody from '@/app/entities/post/detail/PostBody';
import Comments from '@/app/entities/comment/Comments';
import { Metadata } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import PostJSONLd from '@/app/entities/post/detail/PostJSONLd';
import PostActionSection from '@/app/entities/post/detail/PostActionSection';

import PostRecommendation from '@/app/entities/post/detail/PostRecommendation';

const defaultThumbnail = '/images/placeholder/thumbnail_example2.webp';

// 정적 생성할 경로 지정 - SSG
export async function generateStaticParams() {
  await dbConnect();
  const posts = await Post.find({}, 'slug').lean();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ISR 활성화하기
export const revalidate = 60; // 60초마다 재검증

async function getPostDetail(slug: string) {
  await dbConnect();

  const post = await Post.findOne({
    slug: decodeURIComponent(slug),
  }).lean();

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
      images: [post.thumbnailImage || defaultThumbnail],
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author],
    },
    other: {
      'application-name': 'Shipfriend Tech Blog',
      author: post.author,
      publish_date: new Date(post.date).toISOString(),
      'og:type': 'article',
      'article:tag': 'technology,programming,web development',
    },
  };
};

const BlogDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { post } = await getPostDetail(params.slug);
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
            backgroundThumbnail={post?.thumbnailImage || defaultThumbnail}
          />
          <PostBody
            loading={false}
            tags={post?.tags || []}
            content={post?.content || ''}
          />
        </article>
        <PostActionSection postId={post?._id} />
        <PostRecommendation
          tags={post?.tags}
          currentPostId={post?._id}
          seriesId={post?.seriesId}
        />
        <Comments />
      </section>
    </>
  );
};

export default BlogDetailPage;
