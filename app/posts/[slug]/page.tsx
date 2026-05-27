import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Comments from '@/app/entities/comment/Comments';
import PostActionSection from '@/app/entities/post/detail/PostActionSection';
import PostBreadcrumbJSONLd from '@/app/entities/post/detail/PostBreadcrumbJSONLd';
import PostDetail from '@/app/entities/post/detail/PostDetail';
import PostJSONLd from '@/app/entities/post/detail/PostJSONLd';
import PostRecommendation from '@/app/entities/post/detail/PostRecommendation';
import SubscribeToast from '@/app/entities/post/detail/SubscribeToast';
import dbConnect from '@/app/lib/dbConnect';
import { stripMarkdown } from '@/app/lib/utils/stripMarkdown';
import Post from '@/app/models/Post';

const defaultThumbnail = '/images/placeholder/thumbnail_example2.webp';

// 정적 생성할 경로 지정 - SSG
export async function generateStaticParams() {
  await dbConnect();
  const posts = await Post.find({}, 'slug legacySlug').lean<
    { slug: string; legacySlug?: string[] }[]
  >();

  const params: { slug: string }[] = [];
  for (const post of posts) {
    params.push({ slug: post.slug });
    for (const legacy of post.legacySlug ?? []) {
      params.push({ slug: legacy });
    }
  }
  return params;
}

// ISR 활성화하기
export const revalidate = 300; // 300초(5분)마다 재검증

async function getPostDetail(slug: string) {
  await dbConnect();
  const decoded = decodeURIComponent(slug);

  const post = await Post.findOne({ slug: decoded }).lean();

  if (!post) {
    const legacyPost = await Post.findOne(
      { legacySlug: decoded },
      { slug: 1 }
    ).lean<{ slug: string }>();
    if (legacyPost) {
      permanentRedirect(`/posts/${legacyPost.slug}`);
    }
    throw new Error('Post not found');
  }

  return { post: JSON.parse(JSON.stringify(post)) };
}

export const generateMetadata = async (
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> => {
  const params = await props.params;
  const { post } = await getPostDetail(params.slug);
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  const description = post.subTitle
    ? stripMarkdown(post.subTitle, 160)
    : stripMarkdown(post.content, 160);

  return {
    title: post.title,
    description,
    keywords: post.tags,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      images: [post.thumbnailImage || defaultThumbnail],
      type: 'article',
      locale: 'ko_KR',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
    },
    other: {
      'application-name': 'ShipFriend TechBlog',
      author: post.author,
      publish_date: new Date(post.date).toISOString(),
      'article:tag':
        post.tags?.join(',') || 'technology,programming,web development',
      'twitter:card': 'summary_large_image',
      'twitter:title': post.title,
      'twitter:description': description,
      'twitter:image': String(post.thumbnailImage || defaultThumbnail),
    },
  };
};

const BlogDetailPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { post } = await getPostDetail(params.slug);
  return (
    <>
      <PostJSONLd post={post} />
      <PostBreadcrumbJSONLd title={post.title} slug={post.slug} />
      <section className="bg-transparent w-full flex-grow">
        <PostDetail post={post} />
        <PostActionSection postId={post?._id} />
        <PostRecommendation
          tags={post?.tags}
          currentPostId={post?._id}
          seriesId={post?.seriesId}
        />
        <SubscribeToast />
        <Comments />
      </section>
    </>
  );
};

export default BlogDetailPage;
