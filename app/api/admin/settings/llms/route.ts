import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import { generateLlmsTxt } from '@/app/lib/llmstxt';
import Post from '@/app/models/Post';
import View from '@/app/models/View';

export async function POST() {
  const session = await getServerSession();
  // 관리자 전용
  if (!isAdminSession(session)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const recentPosts = await Post.find({ isPrivate: false })
      .select('title subTitle slug date tags')
      .sort({ date: -1 })
      .limit(3)
      .lean();

    const viewAggregation = await View.aggregate([
      { $group: { _id: '$postId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const popularPostsRaw = await Promise.all(
      viewAggregation.map(async ({ _id, count }) => {
        const post = await Post.findById(_id)
          .select('title subTitle slug date tags isPrivate')
          .lean() as { title: string; subTitle?: string; slug: string; date: number; tags?: string[]; isPrivate?: boolean } | null;
        if (!post || post.isPrivate) return null;
        return { title: post.title, subTitle: post.subTitle, slug: post.slug, date: post.date, tags: post.tags, view: count };
      })
    );
    const popularPosts = popularPostsRaw.filter(
      (p): p is NonNullable<typeof p> => p !== null
    ).slice(0, 3);

    const recentPostsMapped = (recentPosts as unknown as Array<{ title: string; subTitle?: string; slug: string; date: number; tags?: string[] }>);

    generateLlmsTxt(recentPostsMapped, popularPosts);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('llms.txt 재생성 실패:', error);
    return Response.json(
      { success: false, error: 'llms.txt 재생성 실패', detail: String(error) },
      { status: 500 }
    );
  }
}
