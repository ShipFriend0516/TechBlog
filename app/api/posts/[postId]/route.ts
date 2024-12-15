// app/api/posts/[postId]/route.ts
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();
    const post = await Post.findById(params.postId).lean();

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
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedPost = await Post.findByIdAndUpdate(params.postId, body, {
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
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();
    const deletedPost = await Post.findByIdAndDelete(params.postId).lean();

    if (!deletedPost) {
      return Response.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    );
  }
}
