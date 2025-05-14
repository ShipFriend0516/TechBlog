import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import View from '@/app/models/View';
import Like from '@/app/models/Like';
export const GET = async (request: Request) => {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const currentPostId = searchParams.get('currentPostId');
  const seriesId = searchParams.get('seriesId');

  const tags = searchParams.getAll('tags');

  if (seriesId) {
    const seriesPosts = await Post.find({
      seriesId: seriesId,
      _id: { $ne: currentPostId },
    })
      .sort({ date: -1 })
      .limit(3)
      .select('title slug thumbnailImage date timeToRead tags');

    // 시리즈 내 포스트가 충분하면 바로 반환
    if (seriesPosts.length >= 3) {
      return Response.json({ posts: seriesPosts });
    }

    const remainingCount = 3 - seriesPosts.length;

    // 태그 배열 기반 추천 포스트 가져오기
    const recommendedPosts =
      tags.length > 0
        ? await Post.find({
            tags: { $in: tags },
            _id: { $ne: currentPostId },
            seriesId: { $ne: seriesId }, // 이미 가져온 시리즈 제외
          })
            .sort({ date: -1 })
            .limit(remainingCount)
            .select('title slug thumbnailImage date timeToRead')
        : await Post.find({
            _id: { $ne: currentPostId },
            seriesId: { $ne: seriesId },
          })
            .sort({ date: -1 })
            .limit(remainingCount)
            .select('title slug thumbnailImage date timeToRead');

    return Response.json({
      posts: [...seriesPosts, ...recommendedPosts],
    });
  }

  const query =
    tags.length > 0
      ? { tags: { $in: tags }, _id: { $ne: currentPostId } }
      : { _id: { $ne: currentPostId } };

  if (tags.length > 0) {
    const recommendedPosts = await Post.aggregate([
      // 현재 포스트 제외 및 태그 일치 조건
      { $match: query },
      // 태그 일치 개수 계산
      {
        $addFields: {
          matchingTagsCount: {
            $size: {
              $setIntersection: ['$tags', tags],
            },
          },
        },
      },
      // 일치하는 태그가 많은 순서로 정렬
      { $sort: { matchingTagsCount: -1, date: -1 } },
      // 필요한 필드만 선택
      {
        $project: {
          title: 1,
          slug: 1,
          thumbnailImage: 1,
          date: 1,
          timeToRead: 1,
          matchingTagsCount: 1,
        },
      },
      { $limit: 10 },
    ]);

    // 인기도 계산을 위해 조회수와 좋아요 정보 가져오기
    const postsWithStats = await Promise.all(
      recommendedPosts.map(async (post) => {
        const viewCount = await View.countDocuments({ postId: post._id });
        const likeCount = await Like.countDocuments({ postId: post._id });

        // 인기도 점수 계산 (태그 일치 x 3 + 조회수 + 좋아요 × 2)
        const popularityScore =
          post.matchingTagsCount * 3 + viewCount + likeCount * 2;

        return {
          _id: post._id,
          title: post.title,
          slug: post.slug,
          thumbnailImage: post.thumbnailImage,
          date: post.date,
          timeToRead: post.timeToRead,
          matchingTagsCount: post.matchingTagsCount,
          popularityScore,
        };
      })
    );

    // 인기도 순으로 정렬 후 상위 3개 반환
    const sortedPosts = postsWithStats
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 3);

    return Response.json({ posts: sortedPosts });
  } else {
    // 태그가 없는 경우 단순히 인기도로만 정렬
    const recommendedPosts = await Post.find(query)
      .sort({ date: -1 })
      .limit(10)
      .select('title slug thumbnailImage date timeToRead');

    // 인기도 계산을 위해 조회수와 좋아요 정보 가져오기
    const postsWithStats = await Promise.all(
      recommendedPosts.map(async (post) => {
        const viewCount = await View.countDocuments({ postId: post._id });
        const likeCount = await Like.countDocuments({ postId: post._id });

        // 인기도 점수 계산 (조회수 + 좋아요 × 2)
        const popularityScore = viewCount + likeCount * 2;

        return {
          _id: post._id,
          title: post.title,
          slug: post.slug,
          thumbnailImage: post.thumbnailImage,
          date: post.date,
          timeToRead: post.timeToRead,
          popularityScore,
        };
      })
    );

    // 인기도 순으로 정렬 후 상위 3개 반환
    const sortedPosts = postsWithStats
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 3);

    return Response.json({ posts: sortedPosts });
  }
};
