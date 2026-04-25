import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '포트폴리오 | ShipFriend TechBlog',
  description: 'ShipFriend의 프로젝트 포트폴리오입니다.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '포트폴리오 | ShipFriend TechBlog',
    description: 'ShipFriend의 프로젝트 포트폴리오입니다.',
    url:
      (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev') +
      '/portfolio',
    siteName: 'ShipFriend TechBlog',
    locale: 'ko_KR',
    type: 'website',
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const PortfolioLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default PortfolioLayout;
