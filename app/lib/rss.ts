import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';

export async function generateRssFeed(posts: any[]) {
  const site_url = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const feedOptions = {
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
  };

  const feed = new Feed(feedOptions);

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${site_url}/posts/${post.slug}`,
      link: `${site_url}/posts/${post.slug}`,
      description: post.excerpt,
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

  // public 디렉토리에 RSS 파일들을 생성합니다
  const publicDir = path.join(process.cwd(), 'public');

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());
  fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1());
}
