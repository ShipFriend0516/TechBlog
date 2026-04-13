// GET /api/admin/analytics/daily-posts?date=YYYY-MM-DD
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    // 관리자 전용
    if (!isAdminSession(session)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const dateParam = request.nextUrl.searchParams.get('date');
    if (!dateParam) {
      return Response.json({ success: false, error: 'date 파라미터가 필요합니다.' }, { status: 400 });
    }

    await dbConnect();

    const start = new Date(`${dateParam}T00:00:00+09:00`);
    const end = new Date(`${dateParam}T23:59:59+09:00`);

    const posts = await View.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$postId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          title: '$post.title',
          slug: '$post.slug',
          views: 1,
        },
      },
    ]);

    return Response.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching daily posts:', error);
    return Response.json({ success: false, error: '일별 게시글 통계 불러오기 실패' }, { status: 500 });
  }
}
