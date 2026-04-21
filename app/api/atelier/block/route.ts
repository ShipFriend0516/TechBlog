// POST /api/atelier/block - 관리자 전용 사용자 차단 (fingerprint 또는 GitHub ID)
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import BlockedFingerprint from '@/app/models/BlockedFingerprint';

export const POST = async (request: Request) => {
  try {
    await dbConnect();

    // 관리자 전용
    const session = await getServerSession();
    if (!isAdminSession(session)) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as unknown;
    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, error: 'identifier 가 필요합니다.' },
        { status: 400 }
      );
    }

    const { identifier, reason } = body as {
      identifier?: unknown;
      reason?: unknown;
    };

    if (typeof identifier !== 'string' || !identifier.trim()) {
      return Response.json(
        { success: false, error: 'identifier 는 필수입니다.' },
        { status: 400 }
      );
    }

    // identifier가 UUID 형태(36자)인지 확인하여 fingerprint 또는 githubId로 판별
    const isUUID = identifier.length === 36 && identifier.includes('-');
    const blockData = isUUID
      ? { fingerprint: identifier }
      : { githubId: identifier };

    // 이미 차단된 경우 무시
    const existing = await BlockedFingerprint.findOne(blockData);
    if (existing) {
      return Response.json(
        { success: true, alreadyBlocked: true },
        { status: 200 }
      );
    }

    await BlockedFingerprint.create({
      ...blockData,
      reason: typeof reason === 'string' ? reason : undefined,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Atelier block POST error:', error);
    return Response.json(
      { success: false, error: '차단 처리 실패' },
      { status: 500 }
    );
  }
};
