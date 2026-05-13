import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // /posts/[slug] 페이지 진입 시 HTTP Referer 헤더를 쿠키로 저장
  if (request.nextUrl.pathname.startsWith('/posts/')) {
    const referer = request.headers.get('referer') ?? '';
    const response = NextResponse.next();
    response.cookies.set('x-page-referrer', referer, {
      maxAge: 60,       // 1분만 유지
      path: '/',
      sameSite: 'lax',
      httpOnly: false,  // 클라이언트 JS에서 읽어야 함
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/posts/:path*',
};
