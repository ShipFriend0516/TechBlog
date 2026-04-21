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

    // fingerprint 헤더 (GitHub 미로그인) 또는 요청 바디의 githubId (GitHub 로그인)
    // 둘 중 하나는 반드시 있어야 함
    const fingerprint = request.headers.get('X-Fingerprint') || '';

    const body = (await request.json()) as unknown;
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: 'emoji 가 필요합니다.' },
        { status: 400 }
      );
    }
    const { emoji, nickname, avatarUrl, githubId } = body as {
      emoji: string;
      nickname?: string;
      avatarUrl?: string;
      githubId?: string;
    };

    if (!fingerprint && !githubId) {
      return Response.json(
        { success: false, error: 'Fingerprint 또는 GitHub 로그인이 필요합니다.' },
        { status: 400 }
      );
    }

    // 차단 검사 (fingerprint 또는 githubId)
    const orConditions = [];
    if (fingerprint) {
      orConditions.push({ fingerprint });
    }
    if (githubId) {
      orConditions.push({ githubId });
    }
    const blocked = await BlockedFingerprint.findOne({
      $or: orConditions,
    }).lean();
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

    if (!allowedEmojiSet.has(emoji)) {
      return Response.json(
        { success: false, error: '허용되지 않은 이모지입니다.' },
        { status: 400 }
      );
    }

    // 현재 반응자 식별자 (fingerprint 또는 github:${githubId})
    const identifier = githubId ? `github:${githubId}` : fingerprint;

    // 메시지 조회 후 직접 수정 (findOneAndUpdate 로는 배열 내 조건부 토글이 복잡)
    const message = await AtelierMessage.findById(id);
    if (!message || message.isDeleted) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 해당 이모지 버킷 찾기
    interface ReactorDoc {
      fingerprint?: string;
      nickname: string;
      avatarUrl?: string;
      githubId?: string;
    }
    interface ReactionDoc {
      emoji: string;
      fingerprints: string[];
      count: number;
      reactors: ReactorDoc[];
    }
    const reactions = message.reactions as unknown as ReactionDoc[];
    const bucketIndex = reactions.findIndex((r) => r.emoji === emoji);

    const reactorInfo: ReactorDoc = {
      nickname: nickname ?? '익명',
      ...(fingerprint && { fingerprint }),
      ...(avatarUrl && { avatarUrl }),
      ...(githubId && { githubId }),
    };

    if (bucketIndex === -1) {
      reactions.push({
        emoji,
        fingerprints: [identifier],
        count: 1,
        reactors: [reactorInfo],
      });
    } else {
      const bucket = reactions[bucketIndex];
      const fpIndex = bucket.fingerprints.indexOf(identifier);
      if (fpIndex >= 0) {
        // 이미 눌렀음 → 해제
        bucket.fingerprints.splice(fpIndex, 1);
        bucket.reactors = bucket.reactors.filter((r) => {
          // fingerprint와 githubId 모두 일치하면 제거
          const isMatch = githubId
            ? r.githubId === githubId
            : r.fingerprint === fingerprint;
          return !isMatch;
        });
        bucket.count = bucket.fingerprints.length;
        if (bucket.count === 0) {
          reactions.splice(bucketIndex, 1);
        }
      } else {
        // 새로 추가
        bucket.fingerprints.push(identifier);
        bucket.reactors.push(reactorInfo);
        bucket.count = bucket.fingerprints.length;
      }
    }

    message.markModified('reactions');
    await message.save();

    // 응답 시 fingerprints 제거, hasReacted + reactors 계산
    let anonCounter = 0;
    const responseReactions: ReactionBucket[] = (
      message.reactions as unknown as ReactionDoc[]
    ).map((r) => ({
      emoji: r.emoji,
      count: r.count,
      hasReacted: r.fingerprints.includes(identifier),
      reactors: r.reactors.map((reactor) => {
        if (reactor.githubId) {
          return { displayName: reactor.nickname, avatarUrl: reactor.avatarUrl };
        }
        anonCounter += 1;
        return { displayName: `익명${anonCounter}` };
      }),
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
