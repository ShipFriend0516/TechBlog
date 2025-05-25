// GET /api/posts - 모든 글 조회 (페이지네이션 지원)
import { QuerySelector } from 'mongoose';
import Series from '@/app/models/Series';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { getServerSession } from 'next-auth';
import { generateUniqueSlug } from '@/app/lib/utils/post';
import { getThumbnailInMarkdown } from '@/app/lib/utils/parse';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // 기존 파라미터
    const query = searchParams.get('query') || '';
    const seriesSlug = searchParams.get('series') || '';
    const isCompact = searchParams.get('compact') === 'true';
    const isCanViewPrivate = searchParams.get('private') === 'true';

    // const sortBy: 'date' | 'view' | string = searchParams.get('sort') || 'date';

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
      $and: [...(isCanViewPrivate ? [] : [{ isPublic: true }])],
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

// POST /api/posts - 글 작성 API
export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await dbConnect();
    const {
      title,
      subTitle,
      author,
      content,
      profileImage,
      thumbnailImage,
      seriesId,
      tags,
      isPrivate,
    } = await req.json();

    if (!title || !content || !author || !content) {
      return Response.json(
        { success: false, error: '제목, 소제목, 작성자, 내용은 필수입니다' },
        { status: 400 }
      );
    }

    const post = {
      slug: await generateUniqueSlug(title, Post),
      title,
      subTitle,
      author,
      content,
      timeToRead: Math.ceil(content.length / 500),
      profileImage,
      thumbnailImage: thumbnailImage || getThumbnailInMarkdown(content),
      seriesId: seriesId || null,
      tags: tags || [],
      isPrivate: isPrivate || false,
    };

    const newPost = await Post.create(post);
    if (!newPost) {
      return Response.json(
        { success: false, error: '글 작성 실패' },
        { status: 500 }
      );
    }

    if (post.seriesId) {
      await Series.findByIdAndUpdate(post.seriesId, {
        $push: { posts: newPost._id },
        $inc: { postCount: 1 }, // postCount 1 증가
      });
    }

    return Response.json(
      {
        success: true,
        post: newPost,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Post creation error:', error);
    return Response.json(
      { success: false, error: 'Invalid Post Request' },
      { status: 500 }
    );
  }
}
