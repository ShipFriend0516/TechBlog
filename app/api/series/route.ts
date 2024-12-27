import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Series from '@/app/models/Series';
import { createPostSlug } from '@/app/lib/utils/post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { error: '시리즈 제목을 입력해주세요.' },
        { status: 400 }
      );
    }

    const series = await Series.create({
      slug: createPostSlug(body.title),
      title: body.title,
      description: body.description,
      thumbnailImage: body.thumbnailImage || '',
      order: body.order || [],
      posts: body.posts || [],
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '시리즈 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get('populate') === 'true';

    const query = Series.find({});
    if (populate) {
      query.populate('posts');
    }

    const series = await query;
    return NextResponse.json(series);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '시리즈 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
