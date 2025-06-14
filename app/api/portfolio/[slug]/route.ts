import { portfolioData } from '@/app/api/portfolio/data';

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const slug = params.slug?.toLowerCase();

    if (!slug) {
      return Response.json({ error: 'slug가 필요합니다' }, { status: 400 });
    }

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

export async function generateStaticParams() {
  return Object.keys(portfolioData).map((slug) => ({
    slug: slug,
  }));
}
