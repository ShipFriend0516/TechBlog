import fs from 'fs';
import path from 'path';

interface PostSummary {
  title: string;
  subTitle?: string;
  slug: string;
  date: number;
  tags?: string[];
}

interface PopularPostSummary extends PostSummary {
  view: number;
}

export function generateLlmsTxt(
  recentPosts: PostSummary[],
  popularPosts: PopularPostSummary[]
) {
  const siteUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  const lines: string[] = [
    `# ShipFriend TechBlog`,
    ``,
    `> 개발자 서정우의 기술 블로그로 웹 개발, 소프트웨어 엔지니어링 등 개발 관련 글을 작성합니다.`,
    ``,
    `## About`,
    ``,
    `- 블로그: ${siteUrl}`,
    `- 저자: 서정우 (ShipFriend)`,
    `- 언어: 한국어`,
    `- 주제: 웹 개발, 프론트엔드, 백엔드, DevOps, 소프트웨어 엔지니어링`,
    ``,
    `## 최신 글`,
    ``,
  ];

  for (const post of recentPosts) {
    lines.push(
      `- [${post.title}](${siteUrl}/posts/${post.slug}): ${post.subTitle || ''} (${formatDate(post.date)})`
    );
  }

  lines.push(``);
  lines.push(`## 인기 글`);
  lines.push(``);

  for (const post of popularPosts) {
    lines.push(
      `- [${post.title}](${siteUrl}/posts/${post.slug}): ${post.subTitle || ''} (조회 ${post.view}회)`
    );
  }

  lines.push(``);
  lines.push(`## Optional`);
  lines.push(``);
  lines.push(`- [전체 포스트 목록](${siteUrl}/posts)`);
  lines.push(`- [전체 시리즈 목록](${siteUrl}/series)`);
  lines.push(`- [사이트맵](${siteUrl}/sitemap.xml)`);
  lines.push(``);

  const content = lines.join('\n');

  const publicDir = path.join(process.cwd(), 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), content, 'utf-8');

  return content;
}
