import { portfolioData } from '@/app/api/portfolio/data';

// 포트폴리오 데이터 - 이력서 기반으로 실제 프로젝트 정보 반영

export async function GET(request: Request) {
  try {
    const slug = request.url.split('?slug=').pop()?.toLowerCase();
    const portfolio = portfolioData[slug as keyof typeof portfolioData];

    if (!portfolio) {
      return Response.json(
        { error: '포트폴리오를 찾을 수 없습니다', slug },
        { status: 404 }
      );
    }

    return Response.json(portfolio);
  } catch (error) {
    console.error('포트폴리오 데이터 조회 중 오류:', error);
    return Response.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
