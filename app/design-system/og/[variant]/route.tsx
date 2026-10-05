import { NextRequest } from 'next/server';
import { renderOgImage } from '@/app/lib/og/renderOgImage';
import { getOgVariant } from '@/app/lib/og/variants';

// 시안 비교용 미리보기: /design-system/og/{variant}?title=...&description=...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant: id } = await params;
  const variant = getOgVariant(id);
  if (!variant) {
    return new Response('Unknown OG variant', { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  return renderOgImage({
    variant: variant.id,
    title: searchParams.get('title') ?? undefined,
    description: searchParams.get('description') ?? undefined,
  });
}
