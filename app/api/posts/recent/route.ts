// app/api/posts/latest/route.ts
import Post from '@/app/models/Post';
import dbConnect from '@/app/lib/dbConnect';
import { formatDate } from '@/app/lib/utils/format';

export const dynamic = 'force-dynamic'; // 항상 최신 데이터를 가져오기 위한 설정

export async function GET() {
  try {
    const limit = 1;

    // DB 연결
    await dbConnect();

    const latestPost = await Post.findOne({})
      .select('title subTitle slug date')
      .sort({ date: -1 })
      .limit(limit);

    if (!latestPost || latestPost.length === 0) {
      return new Response(generateEmptyBadgeSVG(), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        },
      });
    }

    // 제목과 부제목 길이 제한
    const title = limitTextLength(latestPost.title, 40);
    const subTitle = latestPost.subTitle
      ? limitTextLength(latestPost.subTitle, 50)
      : '';

    // 날짜 포맷팅
    const dateStr = formatDate(latestPost.date);

    // SVG 배지 생성
    const svg = generateBadgeSVG(title, subTitle, dateStr);

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error generating badge:', error);
    return new Response(generateErrorBadgeSVG(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  }
}

// 텍스트 길이 제한 함수
function limitTextLength(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// 딥그린 색상 상수 정의
const DEEP_GREEN = '#005E20';

// 메인 배지 SVG 생성 함수
function generateBadgeSVG(
  title: string,
  subTitle: string,
  date: string
): string {
  // 배지 크기 계산
  const width = 400;
  const height = subTitle ? 110 : 80; // 부제목 유무에 따라 높이 조정

  // 투명 배경으로 SVG 시작
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="none">
    <!-- 배경 및 테두리 -->
    <rect width="${width}" height="${height}" fill="white"/>
    <rect width="${width}" height="${height}" fill="none" stroke="${DEEP_GREEN}" stroke-width="1"/>
    
    <!-- 배지 제목 영역 - 딥그린 색상 적용 -->
    <text x="20" y="30" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="${DEEP_GREEN}">최신 글 | ShipFriend Tech Blog</text>
    
    <!-- 구분선 - 딥그린 색상 적용 -->
    <line x1="20" y1="40" x2="${width - 20}" y2="40" stroke="${DEEP_GREEN}" stroke-width="1"/>
    
    <!-- 포스트 제목 -->
    <text x="20" y="65" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#333">${escapeXML(title)}</text>`;

  if (subTitle) {
    // 부제목이 있는 경우
    svg += `
    <!-- 부제목 -->
    <text x="20" y="90" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#666">${escapeXML(subTitle)}</text>
    
    <!-- 날짜 (맨 아래) -->
    <text x="${width - 20}" y="${height - 20}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#888" text-anchor="end">${date}</text>`;
  } else {
    // 부제목이 없는 경우
    svg += `
    <!-- 날짜 (중간 아래) -->
    <text x="${width - 20}" y="${height - 20}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#888" text-anchor="end">${date}</text>`;
  }

  svg += `</svg>`;

  return svg;
}

// 빈 배지 생성 함수
function generateEmptyBadgeSVG(): string {
  const width = 400;
  const height = 80;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="none">
    <rect width="${width}" height="${height}" fill="white"/>
    <rect width="${width}" height="${height}" fill="none" stroke="${DEEP_GREEN}" stroke-width="2"/>
    <text x="20" y="30" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="${DEEP_GREEN}">최신 글 | ShipFriend Tech Blog</text>
    <line x1="20" y1="40" x2="${width - 20}" y2="40" stroke="${DEEP_GREEN}" stroke-width="1"/>
    <text x="${width / 2}" y="${height / 2 + 10}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#666" text-anchor="middle">아직 작성된 포스트가 없습니다</text>
  </svg>`;
}

// 에러 배지 생성 함수
function generateErrorBadgeSVG(): string {
  const width = 400;
  const height = 80;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="none">
    <rect width="${width}" height="${height}" fill="white"/>
    <rect width="${width}" height="${height}" fill="none" stroke="${DEEP_GREEN}" stroke-width="2"/>
    <text x="20" y="30" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="${DEEP_GREEN}">최신 글 | ShipFriend Tech Blog</text>
    <line x1="20" y1="40" x2="${width - 20}" y2="40" stroke="${DEEP_GREEN}" stroke-width="1"/>
    <text x="${width / 2}" y="${height / 2 + 10}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#d32f2f" text-anchor="middle">포스트 정보를 불러오는 중 오류가 발생했습니다</text>
  </svg>`;
}

// XML 특수문자 이스케이프 함수
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
