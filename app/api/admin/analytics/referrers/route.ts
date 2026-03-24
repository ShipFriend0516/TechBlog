// GET /api/admin/analytics/referrers?postId=xxx
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';

export const dynamic = 'force-dynamic';

function normalizeReferrer(ref: string): string {
  if (!ref) return '직접 방문';
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return ref;
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const postId = request.nextUrl.searchParams.get('postId');
    const dateParam = request.nextUrl.searchParams.get('date');

    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = postId ? { postId } : {};
    if (dateParam) {
      query.createdAt = {
        $gte: new Date(`${dateParam}T00:00:00+09:00`),
        $lte: new Date(`${dateParam}T23:59:59+09:00`),
      };
    }
    const views = await View.find(query, { referrer: 1 }).lean();

    const counts: Record<string, number> = {};
    for (const v of views) {
      const key = normalizeReferrer((v as { referrer?: string }).referrer ?? '');
      counts[key] = (counts[key] ?? 0) + 1;
    }

    const referrers = Object.entries(counts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return Response.json({ success: true, referrers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching referrers:', error);
    return Response.json({ success: false, error: '유입 경로 통계 불러오기 실패' }, { status: 500 });
  }
}
