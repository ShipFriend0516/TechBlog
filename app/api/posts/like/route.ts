import Like from '@/app/models/View';

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
    return new Response('이미 조회한 유저입니다.', { status: 203 });
  } else {
    await Like.create({
      postId,
      fingerprint,
    })
      .then(() => {
        return new Response('좋아요 증가 성공', { status: 200 });
      })
      .catch((error) => {
        console.error('좋아요 증가 오류:', error);
        return new Response('좋아요 증가 실패', { status: 500 });
      });
  }
};

export const DELETE = async (request: Request) => {
  const { postId, fingerprint } = await request.json();
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
    await Like.deleteOne({ postId, fingerprint })
      .then(() => {
        return new Response('좋아요 취소 성공', { status: 200 });
      })
      .catch((error) => {
        console.error('좋아요 취소 오류:', error);
        return new Response('좋아요 취소 실패', { status: 500 });
      });
  }
};
