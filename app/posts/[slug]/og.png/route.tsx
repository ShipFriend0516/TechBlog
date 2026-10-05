import dbConnect from '@/app/lib/dbConnect';
import { renderOgImage } from '@/app/lib/og/renderOgImage';
import { SELECTED_OG_VARIANT } from '@/app/lib/og/variants';
import { stripMarkdown } from '@/app/lib/utils/stripMarkdown';
import Post from '@/app/models/Post';

export const revalidate = 300;

// 썸네일이 없는 글의 OG 이미지: /posts/{slug}/og.png
export async function GET(_req: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  await dbConnect();

  const post = (await Post.findOne(
    {
      slug: decodeURIComponent(params.slug),
      $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
    },
    { title: 1, subTitle: 1, content: 1 },
  ).lean()) as { title: string; subTitle?: string; content: string } | null;

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  return renderOgImage({
    variant: SELECTED_OG_VARIANT,
    title: post.title,
    description: stripMarkdown(post.subTitle || post.content, 120),
  });
}
