import { NextResponse } from 'next/server';
import Post from '@/app/models/Post';
import dbConnect from '@/app/lib/dbConnect';

export const dynamic = 'force-dynamic'; // 캐싱 방지

export async function GET() {
  try {
    await dbConnect();
    const pageUrl = process.env.NEXTAUTH_URL;

    // 최신 글 1개 가져오기
    const latestPost = await Post.findOne({}).sort({ date: -1 }).select('slug');

    if (!latestPost) {
      // 블로그 홈페이지로 리다이렉션 (글이 없는 경우)
      return NextResponse.redirect(new URL(`${pageUrl}/posts`));
    }

    // 최신 글로 리다이렉션
    return NextResponse.redirect(
      new URL(`${pageUrl}/posts/${latestPost.slug}`)
    );
  } catch (error) {
    console.error('Error redirecting to latest post:', error);
    return NextResponse.redirect(new URL(`${process.env.NEXTAUTH_URL}/posts`));
  }
}
