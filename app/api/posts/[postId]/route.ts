// GET /api/posts - 모든 글 조회
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const _id = params.postId;
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
