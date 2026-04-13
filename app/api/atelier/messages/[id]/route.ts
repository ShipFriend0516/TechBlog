// DELETE /api/atelier/messages/[id] - 관리자 전용 소프트 삭제
// PATCH  /api/atelier/messages/[id] - 관리자 전용 isPublic 토글
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import AtelierMessage from '@/app/models/AtelierMessage';

interface RouteParams {
  params: { id: string };
}

export const DELETE = async (_request: Request, { params }: RouteParams) => {
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

    const { id } = params;
    if (!id) {
      return Response.json(
        { success: false, error: 'id 가 필요합니다.' },
        { status: 400 }
      );
    }

    const updated = await AtelierMessage.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Atelier message DELETE error:', error);
    return Response.json(
      { success: false, error: '메시지 삭제 실패' },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request, { params }: RouteParams) => {
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
      typeof (body as { isPublic?: unknown }).isPublic !== 'boolean'
    ) {
      return Response.json(
        { success: false, error: 'isPublic (boolean) 이 필요합니다.' },
        { status: 400 }
      );
    }

    const { isPublic } = body as { isPublic: boolean };

    const updated = await AtelierMessage.findByIdAndUpdate(
      id,
      { isPublic },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, isPublic: updated.isPublic },
      { status: 200 }
    );
  } catch (error) {
    console.error('Atelier message PATCH error:', error);
    return Response.json(
      { success: false, error: '메시지 수정 실패' },
      { status: 500 }
    );
  }
};
