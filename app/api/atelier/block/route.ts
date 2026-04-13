// POST /api/atelier/block - 관리자 전용 fingerprint 차단
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
    if (
      !body ||
      typeof body !== 'object' ||
      typeof (body as { fingerprint?: unknown }).fingerprint !== 'string'
    ) {
      return Response.json(
        { success: false, error: 'fingerprint 가 필요합니다.' },
        { status: 400 }
      );
    }

    const { fingerprint, reason } = body as {
      fingerprint: string;
      reason?: unknown;
    };

    if (!fingerprint.trim()) {
      return Response.json(
        { success: false, error: 'fingerprint 는 비어 있을 수 없습니다.' },
        { status: 400 }
      );
    }

    // upsert 스타일로 이미 존재하면 무시
    const existing = await BlockedFingerprint.findOne({ fingerprint });
    if (existing) {
      return Response.json(
        { success: true, alreadyBlocked: true },
        { status: 200 }
      );
    }

    await BlockedFingerprint.create({
      fingerprint,
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
