// GET /api/posts - 모든 글 조회
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get('_id');
    if (!_id) {
      return Response.json({
        success: false,
        error: 'Invalid Post Request',
        status: 400,
      });
    }
    await dbConnect();

    const post = await Post.findOne({ _id }).lean();

    return Response.json({ success: true, post: post });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Cannot Find Posts' });
  }
}
