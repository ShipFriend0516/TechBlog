import { NextResponse } from 'next/server';
import { getFeed, FEED_CACHE_CONTROL } from '@/app/lib/getFeed';

// 요청 시점에 DB에서 생성합니다. (서버리스 환경에서 파일 시스템 쓰기에 의존하지 않음)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const feed = await getFeed();
    return new NextResponse(feed.atom1(), {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': FEED_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error('Atom 피드 생성 중 오류 발생:', error);
    return new NextResponse('Atom 피드를 생성할 수 없습니다.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
