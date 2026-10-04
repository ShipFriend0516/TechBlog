import { Metadata } from 'next';
import { portfolioData } from '@/app/api/portfolio/data';
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/app/lib/site';
import PortfolioDetailClient from './PortfolioDetailClient';

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
      url: `${SITE_URL}/portfolio/${params.slug}`,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: portfolio.mainImage
        ? [{ url: absoluteUrl(portfolio.mainImage), alt: portfolio.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.title} | ShipFriend TechBlog`,
      description: portfolio.description,
      images: portfolio.mainImage
        ? [absoluteUrl(portfolio.mainImage)]
        : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/portfolio/${params.slug}`,
    },
  };
}

const PortfolioDetailPage = async (props: PortfolioDetailPageProps) => {
  const params = await props.params;
  return <PortfolioDetailClient params={params} />;
};

export default PortfolioDetailPage;
