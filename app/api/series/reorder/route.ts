import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { isAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import Series from '@/app/models/Series';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!isAdminSession(session)) {
      return new Response('Unauthorized', { status: 401 });
    }

    await dbConnect();
    const { slugs } = await request.json();

    if (!Array.isArray(slugs)) {
      return NextResponse.json(
        { error: 'slugs 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    const operations = slugs.map((slug: string, index: number) => ({
      updateOne: {
        filter: { slug },
        update: { sortOrder: index },
      },
    }));

    await Series.bulkWrite(operations);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '순서 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
