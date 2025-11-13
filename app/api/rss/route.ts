import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { generateRssFeed } from '@/app/lib/rss';
import Post from '@/app/models/Post';

export async function GET() {
  // 모든 게시물 가져오기
  await dbConnect();

  const posts = await Post.find({}).limit(50).sort({ date: -1 }).lean();

  // RSS 피드 생성
  console.log('Generating RSS feed...');
  await generateRssFeed(posts);

  return NextResponse.json({ success: true }, { status: 200 });
}
