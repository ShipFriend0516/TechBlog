import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Series from '@/app/models/Series';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const series = await Series.findOne({ slug: params.slug }).populate(
      'posts'
    );

    if (!series) {
      return NextResponse.json(
        { error: '해당 시리즈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(series);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '시리즈 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();

    const updatedSeries = await Series.findOneAndUpdate(
      { slug: params.slug },
      {
        title: body.title,
        description: body.description,
        thumbnailImage: body.thumbnailImage,
        order: body.order,
        posts: body.posts,
      },
      { new: true }
    ).populate('posts');

    if (!updatedSeries) {
      return NextResponse.json(
        { error: '수정할 시리즈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSeries);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '시리즈 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const deletedSeries = await Series.findOneAndDelete({ slug: params.slug });

    if (!deletedSeries) {
      return NextResponse.json(
        { error: '삭제할 시리즈를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: '시리즈가 성공적으로 삭제되었습니다.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '시리즈 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
