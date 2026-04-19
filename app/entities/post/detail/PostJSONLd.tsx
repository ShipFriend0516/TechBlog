import { stripMarkdown } from '@/app/lib/utils/stripMarkdown';
import { Post } from '@/app/types/Post';

const PostJSONLd = ({ post }: { post: Post }) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'https://shipfriend.dev';

  const postUrl = `${baseUrl}/posts/${post.slug}`;

  const description = post.subTitle
    ? stripMarkdown(post.subTitle, 160)
    : stripMarkdown(post.content, 160);

  const imageUrl = post.thumbnailImage
    ? String(post.thumbnailImage).startsWith('http')
      ? String(post.thumbnailImage)
      : `${baseUrl}${post.thumbnailImage}`
    : `${baseUrl}/assets/apple-touch-icon.png`;

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    alternativeHeadline: post.subTitle,
    description,
    inLanguage: 'ko-KR',
    keywords: post.tags?.join(', '),
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://github.com/ShipFriend0516',
      sameAs: ['https://github.com/ShipFriend0516'],
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updatedAt || post.date).toISOString(),
    wordCount: post.content.split(/\s+/g).length,
    timeRequired: `PT${post.timeToRead}M`,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'ShipFriend TechBlog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/apple-touch-icon.png`,
      },
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${baseUrl}/#website`,
      name: 'ShipFriend TechBlog',
      url: baseUrl,
    },
  }).replace(/<\//g, '<\\/');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
export default PostJSONLd;
