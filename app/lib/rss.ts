import { Feed } from 'feed';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/app/lib/site';

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
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: `${SITE_URL}/`,
    link: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/android-chrome-512x512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    generator: 'Feed for Next.js',
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
      json: `${SITE_URL}/feed.json`,
      atom: `${SITE_URL}/atom.xml`,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
      link: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
      description: post.subTitle,
      content: post.content,
      author: [
        {
          name: '개발자 서정우',
          email: 'sjw4371@naver.com',
          link: `${SITE_URL}/`,
        },
      ],
      date: new Date(post.date),
    });
  });

  return feed;
}
