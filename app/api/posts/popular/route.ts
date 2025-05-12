import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';
import Post from '@/app/models/Post';

export const GET = async () => {
  await dbConnect();

  // postId를 가장 많이 조회된 순으로
  try {
    const postIds = await View.aggregate([
      {
        $group: {
          _id: '$postId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const posts = await Promise.all(
      postIds.map(async (postId) => {
        return {
          ...(await Post.findById(postId._id).lean()),
          view: postId.count,
        };
      })
    );

    return Response.json({ posts: posts }, { status: 200 });
  } catch (error) {
    console.error('인기 글 id를 조회 중 실패', error);
    return Response.json(
      { success: false, error: '인기 글 id를 조회 중 실패', detail: error },
      { status: 500 }
    );
  }
};
