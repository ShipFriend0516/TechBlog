import dbConnect from '@/app/lib/dbConnect';
import AtelierMessage from '@/app/models/AtelierMessage';
import Post from '@/app/models/Post';
import Series from '@/app/models/Series';
import SiteSetting from '@/app/models/SiteSetting';
import View from '@/app/models/View';
import {
  AtelierPreviewMessage,
  BlogStats,
  HomePost,
  HomeSeries,
  NowData,
  PopularPost,
  StarPost,
} from '@/app/types/Home';

const PUBLIC_FILTER = { isPrivate: { $ne: true } };

export const NOW_SETTING_KEY = 'now';

const toHomePost = (post: Record<string, unknown>): HomePost => ({
  slug: post.slug as string,
  title: post.title as string,
  subTitle: (post.subTitle as string) || undefined,
  date: post.date as number,
  timeToRead: post.timeToRead as number | undefined,
  thumbnailImage: (post.thumbnailImage as string) || undefined,
  tags: (post.tags as string[]) ?? [],
});

export const getLatestPosts = async (limit: number): Promise<HomePost[]> => {
  await dbConnect();
  const posts = await Post.find(PUBLIC_FILTER)
    .select('slug title subTitle date timeToRead thumbnailImage tags')
    .sort({ date: -1 })
    .limit(limit)
    .lean();
  return (posts as Record<string, unknown>[]).map(toHomePost);
};

// 조회수 기준 인기 글 — 비공개 글은 제외
export const getPopularPosts = async (limit: number): Promise<PopularPost[]> => {
  await dbConnect();
  const ranked = await View.aggregate<{ post: Record<string, unknown>; count: number }>([
    { $group: { _id: '$postId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit * 3 },
    {
      $lookup: {
        from: Post.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'post',
      },
    },
    { $unwind: '$post' },
    { $match: { 'post.isPrivate': { $ne: true } } },
    { $limit: limit },
  ]);
  return ranked.map(({ post, count }) => ({ ...toHomePost(post), view: count }));
};

export const getSeriesList = async (limit: number): Promise<HomeSeries[]> => {
  await dbConnect();
  const series = await Series.find({ postCount: { $gt: 0 } })
    .select('slug title description postCount thumbnailImage')
    .sort({ sortOrder: 1, date: -1 })
    .limit(limit)
    .lean();
  return (series as Record<string, unknown>[]).map((s) => ({
    slug: s.slug as string,
    title: s.title as string,
    description: (s.description as string) || undefined,
    postCount: s.postCount as number,
    thumbnailImage: (s.thumbnailImage as string) || undefined,
  }));
};

// 별자리 타임라인 — 공개 글 전체와 각 글의 조회수
export const getStarPosts = async (): Promise<StarPost[]> => {
  await dbConnect();
  const [posts, views] = await Promise.all([
    Post.find(PUBLIC_FILTER).select('slug title date seriesId').sort({ date: 1 }).lean(),
    View.aggregate<{ _id: unknown; count: number }>([
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]),
  ]);
  const viewMap = new Map(views.map((v) => [String(v._id), v.count]));
  return (posts as Record<string, unknown>[]).map((p) => ({
    slug: p.slug as string,
    title: p.title as string,
    date: p.date as number,
    view: viewMap.get(String(p._id)) ?? 0,
    seriesId: p.seriesId ? String(p.seriesId) : undefined,
  }));
};

export const getBlogStats = async (): Promise<BlogStats> => {
  await dbConnect();
  const [postCount, firstPost] = await Promise.all([
    Post.countDocuments(PUBLIC_FILTER),
    Post.findOne(PUBLIC_FILTER).select('date').sort({ date: 1 }).lean(),
  ]);
  return {
    postCount,
    firstPostDate: (firstPost as { date?: number } | null)?.date ?? null,
    generatedAt: Date.now(),
  };
};

export const getAtelierPreview = async (
  limit: number
): Promise<AtelierPreviewMessage[]> => {
  await dbConnect();
  const messages = await AtelierMessage.find({
    parentId: null,
    isPublic: true,
    isDeleted: { $ne: true },
  })
    .select('content role author createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return (messages as Record<string, unknown>[]).map((m) => {
    const author = m.author as { nickname: string; avatarUrl?: string };
    return {
      id: String(m._id),
      content: m.content as string,
      nickname: author.nickname,
      avatarUrl: author.avatarUrl,
      role: m.role as 'owner' | 'visitor',
      createdAt: new Date(m.createdAt as Date).toISOString(),
    };
  });
};

export const getNow = async (): Promise<NowData> => {
  await dbConnect();
  const setting = (await SiteSetting.findOne({ key: NOW_SETTING_KEY }).lean()) as {
    value?: { items?: NowData['items'] };
    updatedAt?: Date;
  } | null;
  return {
    items: setting?.value?.items ?? [],
    updatedAt: setting?.updatedAt ? new Date(setting.updatedAt).toISOString() : null,
  };
};
