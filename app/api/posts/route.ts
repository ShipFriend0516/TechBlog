import Post from '@/app/models/Post';
import dbConnect from '@/app/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { getThumbnailInMarkdown } from '@/app/lib/utils/parse';
import { generateUniqueSlug } from '@/app/lib/utils/post';
import Series from '@/app/models/Series';
import { QuerySelector } from 'mongoose';

// GET /api/posts - 모든 글 조회
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const query = searchParams.get('query') || '';
    const seriesSlug = searchParams.get('series') || '';

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

    const posts = await Post.find(searchConditions)
      .sort({ date: -1 })
      .limit(10);

    return Response.json({ success: true, posts: posts });
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
