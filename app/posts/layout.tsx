import { Suspense } from 'react';
import Loading from './[slug]/loading';
import { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Posts | ShipFriend TechBlog',
  description:
    '주제별로 정리된 포스트 목록입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
  keywords: [
    'ShipFriend',
    '포스트',
    '개발 시리즈',
    '기술 블로그 시리즈',
    'TechBlog',
  ],
  openGraph: {
    title: 'Posts | ShipFriend TechBlog',
    description:
      '주제별로 정리된 포스트 목록입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
    url:
      (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev') +
      '/posts',
    siteName: 'ShipFriend TechBlog',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: '/posts',
  },
};

const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Layout;
