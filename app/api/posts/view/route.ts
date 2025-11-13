import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import View from '@/app/models/View';

export const POST = async (request: Request) => {
  const { postId } = await request.json();
  const fingerprint = request.headers.get('X-Fingerprint') || '';

  if (!postId) {
    return new Response('postId가 필요합니다.', { status: 400 });
  }
  if (!fingerprint) {
    return new Response('Fingerprint가 필요합니다.', { status: 400 });
  }

  await dbConnect();

  const existingLike = await View.findOne({ postId, fingerprint });
  if (existingLike) {
    const viewCount = await View.countDocuments({ postId });
    return Response.json(
      { message: '이미 조회한 유저입니다.', viewCount },
      { status: 203 }
    );
  } else {
    const result = await View.create({
      postId,
      fingerprint,
    });

    const viewCount = await View.countDocuments({ postId });

    if (result) {
      return Response.json(
        { message: '조회수 증가 성공', viewCount },
        { status: 200 }
      );
    } else {
      return Response.json(
        { message: '조회수 증가 실패', viewCount },
        { status: 500 }
      );
    }
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const postId = request.nextUrl.searchParams.get('postId') || '';
    const fingerprint = request.headers.get('X-Fingerprint') || '';

    if (!postId) {
      return new Response('postId가 필요합니다.', { status: 400 });
    }
    if (!fingerprint) {
      return new Response('Fingerprint가 필요합니다.', { status: 400 });
    }
    await dbConnect();

    const viewCount = (await View.countDocuments({ postId })) || 0;

    return Response.json(
      {
        viewCount: viewCount,
        message: '조회수 가져오기 성공',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('조회수 가져오기 오류:', error);
    return new Response('조회수 가져오기 실패', { status: 500 });
  }
};
