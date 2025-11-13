// GET /api/admin/posts/recent - 관리자용 최근 게시글 조회
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

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

    const recentPosts = await Post.find({})
      .select('title slug date createdAt')
      .sort({ date: -1 })
      .limit(3);

    return Response.json(
      {
        success: true,
        posts: recentPosts,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return Response.json(
      { success: false, error: '최근 게시글 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
