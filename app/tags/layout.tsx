import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';

export const metadata: Metadata = {
  title: '태그 | ShipFriend TechBlog',
  description:
    'ShipFriend TechBlog의 태그 목록 페이지입니다. React, TypeScript, Next.js 등 개발 주제별 글을 탐색해보세요.',
  keywords: [
    'ShipFriend',
    '태그',
    '개발 태그',
    '기술 블로그',
    'TechBlog',
    'React',
    'JavaScript',
    'TypeScript',
  ],
  openGraph: {
    title: '태그 | ShipFriend TechBlog',
    description:
      'ShipFriend TechBlog의 태그 목록 페이지입니다. React, TypeScript, Next.js 등 개발 주제별 글을 탐색해보세요.',
    url: `${BASE_URL}/tags`,
    siteName: 'ShipFriend TechBlog',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/tags`,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const TagsLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default TagsLayout;
