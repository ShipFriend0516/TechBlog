// GET  /api/atelier/messages - 커서 기반 역방향 무한 스크롤
// POST /api/atelier/messages - 메시지 전송 (관리자 / 방문자 자동 분기)
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { decodeCursor, encodeCursor } from '@/app/lib/atelierCursor';
import {
  LeanAtelierMessage,
  serializeAtelierMessage,
} from '@/app/lib/atelierSerialize';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import { checkRateLimit } from '@/app/lib/rateLimit';
import AtelierMessage from '@/app/models/AtelierMessage';
import BlockedFingerprint from '@/app/models/BlockedFingerprint';

export const dynamic = 'force-dynamic';

// ========= GET =========
export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    const session = await getServerSession();
    const isAdmin = isAdminSession(session);

    const cursorParam = request.nextUrl.searchParams.get('cursor');
    const limitParam = request.nextUrl.searchParams.get('limit');
    const parsedLimit = limitParam ? parseInt(limitParam, 10) : 30;
    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50
        ? parsedLimit
        : 30;

    const cursorDate = decodeCursor(cursorParam);

    // 쿼리 구성 — 최상위 피드만, 삭제 제외
    const query: Record<string, unknown> = {
      parentId: null,
      isDeleted: false,
    };
    if (cursorDate) {
      query.createdAt = { $lt: cursorDate };
    }
    if (!isAdmin) {
      query.isPublic = true;
    }

    const viewerFingerprint = request.headers.get('X-Fingerprint') || null;

    // hasMore 판정을 위해 limit + 1 조회
    const docs = (await AtelierMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean()) as unknown as LeanAtelierMessage[];

    const hasMore = docs.length > limit;
    const sliced = hasMore ? docs.slice(0, limit) : docs;

    // 오래된 → 최신 순으로 뒤집어 응답 (ASC)
    const ascending = [...sliced].reverse();

    const nextCursor =
      hasMore && sliced.length > 0
        ? encodeCursor(
            sliced[sliced.length - 1].createdAt instanceof Date
              ? (sliced[sliced.length - 1].createdAt as Date)
              : new Date(sliced[sliced.length - 1].createdAt as unknown as string)
          )
        : null;

    const messages = ascending.map((d) =>
      serializeAtelierMessage(d, viewerFingerprint)
    );

    return Response.json(
      {
        success: true,
        messages,
        nextCursor,
        hasMore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Atelier messages GET error:', error);
    return Response.json(
      { success: false, error: '메시지 목록 불러오기 실패' },
      { status: 500 }
    );
  }
};

// ========= POST =========
export const POST = async (request: Request) => {
  try {
    await dbConnect();

    const fingerprint = request.headers.get('X-Fingerprint') || '';
    const session = await getServerSession();
    const isAdmin = isAdminSession(session);

    const body = (await request.json()) as unknown;
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: '잘못된 요청 본문입니다.' },
        { status: 400 }
      );
    }

    const { content, nickname, parentId } = body as {
      content?: unknown;
      nickname?: unknown;
      parentId?: unknown;
    };

    // content 검증
    if (typeof content !== 'string') {
      return Response.json(
        { success: false, error: '내용이 필요합니다.' },
        { status: 400 }
      );
    }
    const trimmed = content.trim();
    if (trimmed.length < 1 || trimmed.length > 2000) {
      return Response.json(
        { success: false, error: '내용은 1~2000자여야 합니다.' },
        { status: 400 }
      );
    }

    // 관리자가 아닌 경우 fingerprint 필수 + 차단 검사 + rate limit
    if (!isAdmin) {
      if (!fingerprint) {
        return Response.json(
          { success: false, error: 'Fingerprint 헤더가 필요합니다.' },
          { status: 400 }
        );
      }

      const blocked = await BlockedFingerprint.findOne({ fingerprint }).lean();
      if (blocked) {
        return Response.json(
          { success: false, error: '차단된 사용자입니다.' },
          { status: 403 }
        );
      }

      // rate limit — fingerprint 단위 (1분 3회, rateLimit.ts 기본값)
      const { allowed } = checkRateLimit(`atelier:${fingerprint}`);
      if (!allowed) {
        return Response.json(
          {
            success: false,
            error: '너무 빠른 요청입니다. 잠시 후 다시 시도해주세요.',
          },
          { status: 429 }
        );
      }
    }

    // role / author 결정
    let role: 'owner' | 'visitor';
    let author: {
      nickname: string;
      githubId?: string;
      avatarUrl?: string;
      fingerprint?: string;
    };

    if (isAdmin) {
      // 관리자 = 블로그 주인
      role = 'owner';
      author = {
        nickname: session?.user?.name || 'Owner',
        avatarUrl: session?.user?.image || undefined,
        // 관리자는 fingerprint 불필요
      };
    } else if (session?.user) {
      // GitHub 로그인 방문자
      role = 'visitor';
      author = {
        nickname:
          session.user.name ||
          (typeof nickname === 'string' && nickname.trim()) ||
          '익명',
        avatarUrl: session.user.image || undefined,
        fingerprint,
      };
    } else {
      // 비로그인 방문자 — 닉네임 필수
      if (typeof nickname !== 'string' || !nickname.trim()) {
        return Response.json(
          { success: false, error: '닉네임이 필요합니다.' },
          { status: 400 }
        );
      }
      const trimmedNick = nickname.trim();
      if (trimmedNick.length > 30) {
        return Response.json(
          { success: false, error: '닉네임은 최대 30자입니다.' },
          { status: 400 }
        );
      }
      role = 'visitor';
      author = {
        nickname: trimmedNick,
        fingerprint,
      };
    }

    // parentId 유효성 검사 (있으면)
    let parentObjectId: string | null = null;
    if (parentId !== undefined && parentId !== null) {
      if (typeof parentId !== 'string' || parentId.length === 0) {
        return Response.json(
          { success: false, error: '잘못된 parentId 입니다.' },
          { status: 400 }
        );
      }
      // 존재하는 부모인지 확인
      const parent = await AtelierMessage.findById(parentId);
      if (!parent || parent.isDeleted) {
        return Response.json(
          { success: false, error: '부모 메시지를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      parentObjectId = parentId;
    }

    // 생성
    const created = await AtelierMessage.create({
      content: trimmed,
      role,
      author,
      parentId: parentObjectId,
      isPublic: true,
      isDeleted: false,
      threadCount: 0,
      reactions: [],
    });

    // 부모 threadCount 증가
    if (parentObjectId) {
      await AtelierMessage.findByIdAndUpdate(parentObjectId, {
        $inc: { threadCount: 1 },
      });
    }

    const viewerFingerprint = fingerprint || null;
    const leanDoc = created.toObject() as unknown as LeanAtelierMessage;
    const serialized = serializeAtelierMessage(leanDoc, viewerFingerprint);

    return Response.json(
      { success: true, message: serialized },
      { status: 201 }
    );
  } catch (error) {
    console.error('Atelier messages POST error:', error);
    return Response.json(
      { success: false, error: '메시지 전송 실패' },
      { status: 500 }
    );
  }
};
