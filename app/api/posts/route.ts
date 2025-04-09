// GET /api/posts - 모든 글 조회 (페이지네이션 지원)
import { QuerySelector } from 'mongoose';
import Series from '@/app/models/Series';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // 기존 파라미터
    const query = searchParams.get('query') || '';
    const seriesSlug = searchParams.get('series') || '';
    const isCompact = searchParams.get('compact') === 'true';

    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // 유효한 페이지 및 제한 확인
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 50 ? limit : 12;

    // 건너뛸 문서 수 계산
    const skip = (validPage - 1) * validLimit;

    const seriesId = seriesSlug
      ? await Series.findOne({ slug: seriesSlug }, '_id')
      : null;

    // 검색 조건 구성
    const searchConditions = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { subTitle: { $regex: query, $options: 'i' } },
      ],
      $and: [],
    };

    if (seriesId) {
      (searchConditions.$and as QuerySelector<string>[]).push({
        seriesId: seriesId._id,
      } as QuerySelector<string>);
    }

    // 검색 조건을 만족하는 총 문서 수 계산
    const totalPosts = await Post.countDocuments(searchConditions);

    // 페이지네이션된 쿼리 구성
    let q = Post.find(searchConditions);

    if (isCompact) {
      q = q.select(
        'slug title _id subTitle author date tags thumbnailImage seriesId timeToRead createdAt updatedAt'
      );
    }

    // 페이지네이션 적용
    const posts = await q.sort({ date: -1 }).skip(skip).limit(validLimit);

    return Response.json(
      {
        success: true,
        posts: posts,
        pagination: {
          totalPosts,
          currentPage: validPage,
          totalPages: Math.ceil(totalPosts / validLimit),
          hasNextPage: skip + posts.length < totalPosts,
          hasPrevPage: validPage > 1,
          limit: validLimit,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: '포스트 목록 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
