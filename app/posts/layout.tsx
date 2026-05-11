import { Suspense } from 'react';
import Loading from './[slug]/loading';
import { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
}

const baseUrl =
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';

export const metadata: Metadata = {
  title: 'Posts | ShipFriend TechBlog',
  description:
    '발행된 글 목록 페이지입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
  keywords: [
    'ShipFriend',
    '개발 블로그',
    '기술 블로그',
    '개발 글',
    'TechBlog',
    'Posts',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Posts | ShipFriend TechBlog',
    description:
      '발행된 글 목록 페이지입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
    url: `${baseUrl}/posts`,
    siteName: 'ShipFriend TechBlog',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/profile/profile-banner.png`,
        width: 1424,
        height: 752,
        alt: 'ShipFriend TechBlog Posts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Posts | ShipFriend TechBlog',
    description:
      '발행된 글 목록 페이지입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
    images: [`${baseUrl}/images/profile/profile-banner.png`],
  },
  alternates: {
    canonical: `${baseUrl}/posts`,
  },
};

const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Layout;
