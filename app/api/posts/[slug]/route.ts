// app/api/posts/[slug]/route.ts
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { NextRequest, NextResponse } from 'next/server';
import { getThumbnailInMarkdown } from '@/app/lib/utils/parse';
import Series from '@/app/models/Series';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params.slug }).lean();

    if (!post) {
      return Response.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, post });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const post = await Post.findOne({ slug: params.slug });

    const updatedPost = await Post.findOneAndUpdate(
      { slug: params.slug },
      { ...body, thumbnailImage: getThumbnailInMarkdown(body.content) },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedPost) {
      return Response.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // 시리즈 변경 처리
    if (post.seriesId?.toString() !== body.seriesId) {
      if (post.seriesId) {
        await Series.findByIdAndUpdate(post.seriesId, {
          $pull: { posts: post._id },
          $inc: { postCount: -1 },
        });
      }

      if (body.seriesId) {
        await Series.findByIdAndUpdate(body.seriesId, {
          $push: { posts: post._id },
          $inc: { postCount: 1 },
        });
      }
    }

    return Response.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: 'Server Error' },
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
    const post = await Post.findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json(
        { error: '삭제할 포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (post.seriesId) {
      await Series.findByIdAndUpdate(post.seriesId, {
        $pull: { posts: post._id },
        $inc: { postCount: -1 },
      });
    }

    await Post.deleteOne({ slug: params.slug });

    return NextResponse.json({
      message: '포스트가 성공적으로 삭제되었습니다.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '포스트 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
