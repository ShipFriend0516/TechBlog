import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import CloudDraft from '@/app/models/CloudDraft';

// GET /api/drafts - 사용자의 클라우드 임시저장본 조회
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 30일 이상 지난 임시저장본이 있다면 삭제
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await CloudDraft.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    // 사용자의 임시저장본 조회 (최신순, 최대 3개)
    const drafts = await CloudDraft.find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return Response.json({ success: true, drafts }, { status: 200 });
  } catch (error) {
    console.error('Cloud draft fetch error:', error);
    return Response.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}

// POST /api/drafts - 클라우드 임시저장본 생성 또는 업데이트
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const {
      draftId,
      title,
      subTitle,
      content,
      tags,
      imageUrls,
      seriesId,
      isPrivate,
    } = await req.json();

    if (!draftId) {
      return Response.json({ error: 'draftId required' }, { status: 400 });
    }

    // 최소 검증: title 또는 content 필수
    if (!title && !content) {
      return Response.json(
        { error: 'Draft must have title or content' },
        { status: 400 }
      );
    }

    const userId = session.user.email;

    // 기존 임시저장본 확인
    const existingDraft = await CloudDraft.findOne({ draftId, userId });

    if (existingDraft) {
      // 기존 임시저장본 업데이트
      const updatedDraft = await CloudDraft.findOneAndUpdate(
        { draftId, userId },
        {
          title,
          subTitle,
          content,
          tags,
          imageUrls,
          seriesId,
          isPrivate,
        },
        { new: true, runValidators: true }
      );

      return Response.json(
        { success: true, draft: updatedDraft },
        { status: 200 }
      );
    } else {
      // 새 임시저장본 생성
      // 3개 제한 확인
      const draftCount = await CloudDraft.countDocuments({ userId });

      if (draftCount >= 3) {
        // 가장 오래된 임시저장본 삭제
        const oldestDraft = await CloudDraft.findOne({ userId })
          .sort({ createdAt: 1 })
          .lean();

        if (oldestDraft && !Array.isArray(oldestDraft)) {
          await CloudDraft.deleteOne({ _id: oldestDraft._id });
        }
      }

      // 새 임시저장본 생성
      const newDraft = await CloudDraft.create({
        draftId,
        userId,
        title,
        subTitle,
        content,
        tags,
        imageUrls,
        seriesId,
        isPrivate,
      });

      return Response.json({ success: true, draft: newDraft }, { status: 201 });
    }
  } catch (error) {
    console.error('Cloud draft save error:', error);
    return Response.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}

// DELETE /api/drafts?draftId=xxx - 특정 클라우드 임시저장본 삭제
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return Response.json({ error: 'draftId required' }, { status: 400 });
    }

    const result = await CloudDraft.deleteOne({
      draftId,
      userId: session.user.email,
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Draft not found' }, { status: 404 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Cloud draft delete error:', error);
    return Response.json({ error: 'Failed to delete draft' }, { status: 500 });
  }
}
