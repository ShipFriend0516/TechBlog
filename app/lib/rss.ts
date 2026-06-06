import { Feed } from 'feed';

export interface FeedPost {
  title: string;
  slug: string;
  subTitle?: string;
  content: string;
  date: number | string | Date;
}

/**
 * 게시물 목록으로 RSS/Atom/JSON 피드 객체를 생성합니다.
 * 서버리스 환경에서는 파일 시스템에 쓸 수 없으므로, 파일로 저장하지 않고
 * 요청 시점에 직렬화(feed.rss2()/atom1()/json1())해서 응답합니다.
 */
export function buildFeed(posts: FeedPost[]) {
  const site_url =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  const feed = new Feed({
    title: 'ShipFriend TechBlog',
    description:
      '개인 개발 블로그로, Nextjs로 개발되었습니다. 개발 관련 글을 작성합니다.',
    id: site_url,
    link: site_url,
    image: `${site_url}/favicon.png`,
    favicon: `${site_url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
      json: `${site_url}/feed.json`,
      atom: `${site_url}/atom.xml`,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${site_url}/posts/${post.slug}`,
      link: `${site_url}/posts/${post.slug}`,
      description: post.subTitle,
      content: post.content,
      author: [
        {
          name: '개발자 서정우',
          email: 'sjw4371@naver.com',
          link: site_url,
        },
      ],
      date: new Date(post.date),
    });
  });

  return feed;
}
