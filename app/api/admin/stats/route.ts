// GET /api/admin/stats - 관리자용 블로그 통계
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import Series from '@/app/models/Series';
import View from '@/app/models/View';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    // 관리자 전용
    if (!isAdminSession(session)) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalPosts, totalSeries, publicPosts, privatePosts, totalViews, todayViews] =
      await Promise.all([
        Post.countDocuments({}),
        Series.countDocuments({}),
        Post.countDocuments({ isPrivate: false }),
        Post.countDocuments({ isPrivate: true }),
        View.countDocuments({}),
        View.countDocuments({ createdAt: { $gte: todayStart } }),
      ]);

    return Response.json(
      {
        success: true,
        stats: {
          totalPosts,
          totalSeries,
          publicPosts,
          privatePosts,
          totalViews,
          todayViews,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json(
      { success: false, error: '통계 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
