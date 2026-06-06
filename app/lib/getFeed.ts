import dbConnect from '@/app/lib/dbConnect';
import { buildFeed, FeedPost } from '@/app/lib/rss';
import Post from '@/app/models/Post';

/**
 * 공개 게시물(비공개 제외) 최신 50건으로 피드 객체를 생성합니다.
 * /rss.xml, /atom.xml, /feed.json 라우트에서 공통으로 사용합니다.
 */
export async function getFeed() {
  await dbConnect();

  const posts = await Post.find({
    $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
  })
    .limit(50)
    .sort({ date: -1 })
    .lean<FeedPost[]>();

  return buildFeed(posts);
}

export const FEED_CACHE_CONTROL =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400';
