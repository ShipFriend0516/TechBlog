import Like from '@/app/models/Like';
import { NextRequest } from 'next/server';

export const POST = async (request: Request) => {
  const { postId } = await request.json();
  const fingerprint = request.headers.get('X-Fingerprint') || '';

  if (!postId) {
    return new Response('postId가 필요합니다.', { status: 400 });
  }
  if (!fingerprint) {
    return new Response('Fingerprint가 필요합니다.', { status: 400 });
  }

  const existingLike = await Like.findOne({ postId, fingerprint });
  if (existingLike) {
    return new Response('이미 좋아요한 유저입니다.', { status: 203 });
  } else {
    const result = await Like.create({
      postId,
      fingerprint,
    });

    if (result) {
      return Response.json({ message: '좋아요 성공' }, { status: 200 });
    } else {
      return Response.json({ message: '좋아요 실패' }, { status: 500 });
    }
  }
};

export const DELETE = async (request: Request) => {
  const { postId } = await request.json();
  const fingerprint = request.headers.get('X-Fingerprint') || '';

  if (!postId) {
    return new Response('postId가 필요합니다.', { status: 400 });
  }
  if (!fingerprint) {
    return new Response('Fingerprint가 필요합니다.', { status: 400 });
  }

  const existingLike = await Like.findOne({ postId, fingerprint });
  if (!existingLike) {
    return new Response('좋아요가 되어있지 않습니다.', { status: 203 });
  } else {
    const result = await Like.deleteOne({ postId, fingerprint });

    if (result) {
      return new Response('좋아요 취소 성공', { status: 200 });
    } else {
      return new Response('좋아요 취소 실패', { status: 500 });
    }
  }
};

export const GET = async (request: NextRequest) => {
  const postId = request.nextUrl.searchParams.get('postId') || '';
  const fingerprint = request.headers.get('X-Fingerprint') || '';

  if (!postId) {
    return new Response('postId가 필요합니다.', { status: 400 });
  }
  const likeCount = (await Like.countDocuments({ postId })) || 0;

  if (!fingerprint) {
    return Response.json(
      {
        message: 'Fingerprint가 없으면 좋아요 여부를 확인할 수 없습니다.',
        isLiked: false,
        likeCount: likeCount,
      },
      { status: 400 }
    );
  }

  const isLiked = await Like.findOne({ postId, fingerprint });

  return Response.json(
    {
      isLiked: !!isLiked,
      likeCount: likeCount,
    },
    { status: 200 }
  );
};
