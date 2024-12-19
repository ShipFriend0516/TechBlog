// app/api/posts/[slug]/route.ts
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { NextRequest } from 'next/server';

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

    const updatedPost = await Post.findByIdAndUpdate(params.slug, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedPost) {
      return Response.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
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
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const deletedPost = await Post.findByIdAndDelete(params.slug).lean();

    if (!deletedPost) {
      return Response.json(
        { success: false, error: '삭제할 글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: '글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}
