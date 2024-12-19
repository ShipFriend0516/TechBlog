import { Post } from '@/app/types/Post';

const PostJSONLd = ({ post }: { post: Post }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          alternativeHeadline: post.subTitle, // 서브타이틀용
          description: post.subTitle || post.content.substring(0, 160),
          articleBody: post.content, // 본문 전체
          author: {
            '@type': 'Person',
            name: post.author,
          },
          datePublished: new Date(post.date).toISOString(),
          dateModified: new Date(post.updatedAt || post.date).toISOString(),
          wordCount: post.content.split(/\s+/g).length,
          timeRequired: `PT${post.timeToRead}M`, // ISO 8601 duration format
          // 이미지가 있는 경우
          image: post.thumbnailImage,
          // 블로그/사이트 정보
          publisher: {
            '@type': 'Organization',
            name: 'ShipFriend TechBlog',
            logo: {
              '@type': 'ImageObject',
              url: `https://oraciondev.vercel.app/favicon.ico`,
            },
          },
        }),
      }}
    />
  );
};
export default PostJSONLd;
