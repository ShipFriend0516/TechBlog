// GET /api/atelier/messages/[id]/thread - 스레드 답글 전체 조회
import { getServerSession } from 'next-auth';
import {
  LeanAtelierMessage,
  serializeAtelierMessage,
} from '@/app/lib/atelierSerialize';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import AtelierMessage from '@/app/models/AtelierMessage';

interface RouteParams {
  params: { id: string };
}

export const GET = async (request: Request, { params }: RouteParams) => {
  try {
    await dbConnect();

    const { id } = params;
    if (!id) {
      return Response.json(
        { success: false, error: 'id 가 필요합니다.' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    const isAdmin = isAdminSession(session);
    const viewerFingerprint = request.headers.get('X-Fingerprint') || null;

    // 쿼리 구성
    const query: Record<string, unknown> = {
      parentId: id,
      isDeleted: false,
    };
    if (!isAdmin) {
      query.isPublic = true;
    }

    // 답글은 오래된 순으로 전부 반환 (페이지네이션 없음)
    const docs = (await AtelierMessage.find(query)
      .sort({ createdAt: 1 })
      .lean()) as unknown as LeanAtelierMessage[];

    const replies = docs.map((d) =>
      serializeAtelierMessage(d, viewerFingerprint)
    );

    return Response.json({ success: true, replies }, { status: 200 });
  } catch (error) {
    console.error('Atelier thread GET error:', error);
    return Response.json(
      { success: false, error: '스레드 불러오기 실패' },
      { status: 500 }
    );
  }
};
