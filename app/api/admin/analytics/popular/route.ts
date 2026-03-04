// GET /api/admin/analytics/popular?type=all|today
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';

export const dynamic = 'force-dynamic';

const commonLookups = [
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
    $lookup: {
      from: 'series',
      localField: 'post.seriesId',
      foreignField: '_id',
      as: 'series',
    },
  },
  {
    $lookup: {
      from: 'likes',
      localField: '_id',
      foreignField: 'postId',
      as: 'likes',
    },
  },
];

const commonProject = {
  _id: 0,
  postId: '$_id',
  title: '$post.title',
  slug: '$post.slug',
  date: '$post.date',
  seriesTitle: { $arrayElemAt: ['$series.title', 0] },
  likeCount: { $size: '$likes' },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const type = request.nextUrl.searchParams.get('type') ?? 'all';

    await dbConnect();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (type === 'today') {
      const posts = await View.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: '$postId', todayViews: { $sum: 1 } } },
        { $sort: { todayViews: -1 } },
        { $limit: 20 },
        ...commonLookups,
        { $project: { ...commonProject, todayViews: 1 } },
      ]);

      return Response.json({ success: true, posts }, { status: 200 });
    }

    // type=all
    const posts = await View.aggregate([
      {
        $group: {
          _id: '$postId',
          totalViews: { $sum: 1 },
          todayViews: {
            $sum: { $cond: [{ $gte: ['$createdAt', todayStart] }, 1, 0] },
          },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 },
      ...commonLookups,
      { $project: { ...commonProject, totalViews: 1, todayViews: 1 } },
    ]);

    return Response.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return Response.json(
      { success: false, error: '인기 게시글 통계 불러오기 실패' },
      { status: 500 }
    );
  }
}
