import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 프로젝트 루트 기준 public 폴더 내 rss.xml 파일 경로
    const filePath = path.join(process.cwd(), 'public', 'rss.xml');

    // 파일 읽기
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // XML 응답 반환
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('RSS 파일 서빙 중 오류 발생:', error);
    return new NextResponse('RSS 파일을 찾을 수 없습니다.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
