import { Metadata } from 'next';
import { portfolioData } from '@/app/api/portfolio/data';
import PortfolioDetailClient from './PortfolioDetailClient';

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const baseUrl =
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';

export async function generateMetadata(props: PortfolioDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const portfolio = portfolioData[params.slug as keyof typeof portfolioData];

  if (!portfolio) {
    return {
      title: '포트폴리오 | ShipFriend TechBlog',
    };
  }

  return {
    title: `${portfolio.title} | ShipFriend TechBlog`,
    description: portfolio.description,
    openGraph: {
      title: `${portfolio.title} | ShipFriend TechBlog`,
      description: portfolio.description,
      url: `${baseUrl}/portfolio/${params.slug}`,
      siteName: 'ShipFriend TechBlog',
      locale: 'ko_KR',
      type: 'website',
      images: portfolio.mainImage
        ? [{ url: `${baseUrl}${portfolio.mainImage}`, alt: portfolio.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.title} | ShipFriend TechBlog`,
      description: portfolio.description,
      images: portfolio.mainImage
        ? [`${baseUrl}${portfolio.mainImage}`]
        : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/portfolio/${params.slug}`,
    },
  };
}

const PortfolioDetailPage = async (props: PortfolioDetailPageProps) => {
  const params = await props.params;
  return <PortfolioDetailClient params={params} />;
};

export default PortfolioDetailPage;
