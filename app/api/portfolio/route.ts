// app/api/portfolio/[slug]/route.ts
import { NextResponse } from 'next/server';

// 샘플 데이터 - 실제로는 데이터베이스에서 가져올 것입니다
const portfolioData = {
  primitive: {
    title: 'Primitive',
    description:
      'Primitive는 디자인 시스템을 위한 현대적인 UI 컴포넌트 라이브러리입니다. 이 프로젝트는 디자이너와 개발자 간의 협업을 효율적으로 만들고, 일관된 사용자 경험을 보장하는 것을 목표로 합니다. TypeScript와 Next.js를 사용하여 유연하고 확장 가능한 컴포넌트를 개발했습니다.',
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Storybook'],
    mainImage: '/images/projects/primitive/main.jpg',
    images: [
      '/images/projects/primitive/screen1.jpg',
      '/images/projects/primitive/screen2.jpg',
      '/images/projects/primitive/screen3.jpg',
      '/images/projects/primitive/screen4.jpg',
      '/images/projects/primitive/screen5.jpg',
    ],
    year: '2024',
    category: '웹 애플리케이션',
  },
  portfolio: {
    title: '개인 포트폴리오',
    description:
      '프론트엔드 개발자로서의 작업물을 소개하기 위한 개인 포트폴리오 웹사이트입니다. Next.js와 TypeScript로 개발되었으며, 애니메이션과 인터랙티브 요소를 통해 방문자들에게 몰입감 있는 경험을 제공합니다.',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'TailwindCSS'],
    mainImage: '/images/projects/portfolio/main.jpg',
    images: [
      '/images/projects/portfolio/screen1.jpg',
      '/images/projects/portfolio/screen2.jpg',
      '/images/projects/portfolio/screen3.jpg',
    ],
    year: '2023',
    category: '웹사이트',
  },
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  // 해당 slug에 맞는 포트폴리오 항목 찾기
  const portfolio = portfolioData[slug as keyof typeof portfolioData];

  if (!portfolio) {
    return NextResponse.json(
      { error: '포트폴리오를 찾을 수 없습니다' },
      { status: 404 }
    );
  }

  // 데이터 응답
  return NextResponse.json(portfolio);
}
