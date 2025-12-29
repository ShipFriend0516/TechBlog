import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import Subscriber from '@/app/models/Subscriber';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const [totalSubscribers, activeSubscribers, verifiedSubscribers] =
      await Promise.all([
        Subscriber.countDocuments({}),
        Subscriber.countDocuments({ isActive: true }),
        Subscriber.countDocuments({ isVerified: true }),
      ]);

    return Response.json(
      {
        success: true,
        stats: {
          totalSubscribers,
          activeSubscribers,
          verifiedSubscribers,
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
    console.error('Error fetching subscriber stats:', error);
    return Response.json(
      { success: false, error: '구독자 통계 불러오기 실패' },
      { status: 500 }
    );
  }
}
