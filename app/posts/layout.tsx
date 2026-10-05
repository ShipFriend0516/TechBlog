import { Metadata } from 'next';
import { Suspense } from 'react';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '@/app/lib/site';
import Loading from './[slug]/loading';

interface LayoutProps {
  children: React.ReactNode;
}

const baseUrl = SITE_URL;

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
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ShipFriend TechBlog Posts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Posts | ShipFriend TechBlog',
    description:
      '발행된 글 목록 페이지입니다. 관심 있는 포스트를 선택해 순서대로 읽어보세요.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: {
    canonical: `${baseUrl}/posts`,
  },
};

const Layout = ({ children }: LayoutProps) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Layout;
