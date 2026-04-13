// GET /api/admin/stats/daily - 최근 14일간 일별 조회수
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    // 관리자 전용
    if (!isAdminSession(session)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const views = await View.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '+09:00' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 14일 전체 날짜 배열 생성 (데이터 없는 날은 0)
    const daily: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '-').replace('.', '');
      // YYYY-MM-DD 형식으로 변환
      const parts = d.toISOString().slice(0, 10);
      const found = views.find((v) => v._id === parts);
      daily.push({ date: parts, count: found ? found.count : 0 });
    }

    return Response.json({ success: true, daily }, { status: 200 });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return Response.json({ success: false, error: '일별 통계 불러오기 실패' }, { status: 500 });
  }
}
