// POST /api/atelier/messages/[id]/reaction - 이모지 반응 토글
import dbConnect from '@/app/lib/dbConnect';
import AtelierMessage from '@/app/models/AtelierMessage';
import BlockedFingerprint from '@/app/models/BlockedFingerprint';
import { ATELIER_EMOJIS, ReactionBucket } from '@/app/types/Atelier';

interface RouteParams {
  params: { id: string };
}

// 허용 이모지 화이트리스트
const allowedEmojiSet = new Set<string>(ATELIER_EMOJIS);

export const POST = async (request: Request, { params }: RouteParams) => {
  try {
    await dbConnect();

    const fingerprint = request.headers.get('X-Fingerprint') || '';
    if (!fingerprint) {
      return Response.json(
        { success: false, error: 'Fingerprint 헤더가 필요합니다.' },
        { status: 400 }
      );
    }

    // 차단 검사
    const blocked = await BlockedFingerprint.findOne({ fingerprint }).lean();
    if (blocked) {
      return Response.json(
        { success: false, error: '차단된 사용자입니다.' },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return Response.json(
        { success: false, error: 'id 가 필요합니다.' },
        { status: 400 }
      );
    }

    const body = (await request.json()) as unknown;
    if (
      !body ||
      typeof body !== 'object' ||
      typeof (body as { emoji?: unknown }).emoji !== 'string'
    ) {
      return Response.json(
        { success: false, error: 'emoji 가 필요합니다.' },
        { status: 400 }
      );
    }
    const { emoji } = body as { emoji: string };
    if (!allowedEmojiSet.has(emoji)) {
      return Response.json(
        { success: false, error: '허용되지 않은 이모지입니다.' },
        { status: 400 }
      );
    }

    // 메시지 조회 후 직접 수정 (findOneAndUpdate 로는 배열 내 조건부 토글이 복잡)
    const message = await AtelierMessage.findById(id);
    if (!message || message.isDeleted) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 해당 이모지 버킷 찾기
    interface ReactionDoc {
      emoji: string;
      fingerprints: string[];
      count: number;
    }
    const reactions = message.reactions as unknown as ReactionDoc[];
    const bucketIndex = reactions.findIndex((r) => r.emoji === emoji);

    if (bucketIndex === -1) {
      // 새 버킷 추가
      reactions.push({
        emoji,
        fingerprints: [fingerprint],
        count: 1,
      });
    } else {
      const bucket = reactions[bucketIndex];
      const fpIndex = bucket.fingerprints.indexOf(fingerprint);
      if (fpIndex >= 0) {
        // 이미 눌렀음 → 해제
        bucket.fingerprints.splice(fpIndex, 1);
        bucket.count = bucket.fingerprints.length;
        if (bucket.count === 0) {
          reactions.splice(bucketIndex, 1);
        }
      } else {
        // 새로 추가
        bucket.fingerprints.push(fingerprint);
        bucket.count = bucket.fingerprints.length;
      }
    }

    message.markModified('reactions');
    await message.save();

    // 응답 시 fingerprints 제거, hasReacted 계산
    const responseReactions: ReactionBucket[] = (
      message.reactions as unknown as ReactionDoc[]
    ).map((r) => ({
      emoji: r.emoji,
      count: r.count,
      hasReacted: r.fingerprints.includes(fingerprint),
    }));

    return Response.json(
      { success: true, reactions: responseReactions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Atelier reaction POST error:', error);
    return Response.json(
      { success: false, error: '반응 처리 실패' },
      { status: 500 }
    );
  }
};
