import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  const post = await Post.findOne({
    slug: decodeURIComponent(params.slug),
    isPrivate: false,
  }).lean() as {
    title: string;
    subTitle?: string;
    slug: string;
    author: string;
    date: number;
    timeToRead: number;
    tags?: string[];
    content: string;
  } | null;

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'https://shipfriend.dev';

  const lines: string[] = [
    `# ${post.title}`,
    ...(post.subTitle ? [``, `> ${post.subTitle}`] : []),
    ``,
    `## 메타데이터`,
    ``,
    `- URL: ${baseUrl}/posts/${post.slug}`,
    `- 저자: ${post.author}`,
    `- 날짜: ${new Date(post.date).toISOString().split('T')[0]}`,
    `- 읽기 시간: ${post.timeToRead}분`,
    ...(post.tags?.length ? [`- 태그: ${post.tags.join(', ')}`] : []),
    ``,
    `## 본문`,
    ``,
    post.content,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
