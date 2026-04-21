// DELETE /api/atelier/messages/[id] - 관리자 또는 소유자 소프트 삭제
// PATCH  /api/atelier/messages/[id] - 관리자 전용 isPublic 토글
// PUT    /api/atelier/messages/[id] - 소유자 또는 관리자 메시지 수정
import { getServerSession } from 'next-auth';
import { serializeAtelierMessage, LeanAtelierMessage } from '@/app/lib/atelierSerialize';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import AtelierMessage from '@/app/models/AtelierMessage';

interface RouteParams {
  params: { id: string };
}

export const DELETE = async (request: Request, { params }: RouteParams) => {
  try {
    await dbConnect();

    const session = await getServerSession();
    const isAdmin = isAdminSession(session);

    const { id } = params;
    if (!id) {
      return Response.json(
        { success: false, error: 'id 가 필요합니다.' },
        { status: 400 }
      );
    }

    const message = await AtelierMessage.findById(id).lean() as LeanAtelierMessage | null;
    if (!message) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 소유권 확인: admin OR 소유자
    let isOwner = false;
    const sessionGithubId = (session?.user as { id?: string })?.id;
    if (sessionGithubId) {
      // 로그인 사용자: githubId로 비교
      isOwner = message.author?.githubId === sessionGithubId;
    } else {
      // 비로그인 사용자: fingerprint로 비교
      const fingerprint = request.headers.get('X-Fingerprint');
      if (fingerprint && message.author?.fingerprint) {
        isOwner = message.author.fingerprint === fingerprint;
      }
    }

    if (!isAdmin && !isOwner) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
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

export const PUT = async (request: Request, { params }: RouteParams) => {
  try {
    await dbConnect();

    const session = await getServerSession();
    const isAdmin = isAdminSession(session);

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
      typeof (body as { content?: unknown }).content !== 'string'
    ) {
      return Response.json(
        { success: false, error: 'content (string) 가 필요합니다.' },
        { status: 400 }
      );
    }

    const { content } = body as { content: string };
    const trimmedContent = content.trim();

    if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
      return Response.json(
        { success: false, error: 'content는 1-2000자여야 합니다.' },
        { status: 400 }
      );
    }

    const message = await AtelierMessage.findById(id).lean() as LeanAtelierMessage | null;
    if (!message) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 삭제된 메시지는 수정 불가
    if (message.isDeleted) {
      return Response.json(
        { success: false, error: '삭제된 메시지는 수정할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 소유권 확인: admin OR 소유자
    let isOwner = false;
    const sessionGithubId = (session?.user as { id?: string })?.id;
    if (sessionGithubId) {
      // 로그인 사용자: githubId로 비교
      isOwner = message.author?.githubId === sessionGithubId;
    } else {
      // 비로그인 사용자: fingerprint로 비교
      const fingerprint = request.headers.get('X-Fingerprint');
      if (fingerprint && message.author?.fingerprint) {
        isOwner = message.author.fingerprint === fingerprint;
      }
    }

    if (!isAdmin && !isOwner) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await AtelierMessage.findByIdAndUpdate(
      id,
      { $set: { content: trimmedContent, isEdited: true } },
      { new: true }
    ).lean() as LeanAtelierMessage | null;

    if (!updated) {
      return Response.json(
        { success: false, error: '메시지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const fingerprint = request.headers.get('X-Fingerprint');
    const githubId =
      (session?.user as { id?: string })?.id || null;
    const serialized = serializeAtelierMessage(updated, fingerprint, githubId);

    return Response.json(
      { success: true, message: serialized },
      { status: 200 }
    );
  } catch (error) {
    console.error('Atelier message PUT error:', error);
    return Response.json(
      { success: false, error: '메시지 수정 실패' },
      { status: 500 }
    );
  }
};
