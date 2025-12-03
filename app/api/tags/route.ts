import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

// GET /api/tags
export async function GET() {
  try {
    await dbConnect();

    const tagStats = await Post.aggregate([
      { $match: { isPrivate: { $ne: true } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ]);

    return Response.json(tagStats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Tags API error:', error);
    return Response.json(
      { success: false, error: '태그 목록 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
