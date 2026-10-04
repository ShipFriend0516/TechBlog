import type { Metadata } from 'next';
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '@/app/lib/site';

export const metadata: Metadata = {
  title: '포트폴리오 | ShipFriend TechBlog',
  description: 'ShipFriend의 프로젝트 포트폴리오입니다.',
  robots: { index: true, follow: true },
  openGraph: {
    title: '포트폴리오 | ShipFriend TechBlog',
    description: 'ShipFriend의 프로젝트 포트폴리오입니다.',
    url: `${SITE_URL}/portfolio`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: '포트폴리오 | ShipFriend TechBlog',
    description: 'ShipFriend의 프로젝트 포트폴리오입니다.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/portfolio`,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const PortfolioLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default PortfolioLayout;
