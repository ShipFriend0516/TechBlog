import { getPublicSeriesPage } from '@/app/lib/getPublicSeriesPage';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cursor = new URL(request.url).searchParams.get('cursor') || undefined;
    const page = await getPublicSeriesPage(cursor);
    return Response.json(page, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid series cursor') {
      return Response.json({ error: 'Invalid cursor' }, { status: 400 });
    }
    console.error('시리즈 목록 조회 실패', error);
    return Response.json({ error: '시리즈 목록 조회 실패' }, { status: 500 });
  }
}
