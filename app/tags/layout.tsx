import type { Metadata } from 'next';
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '@/app/lib/site';

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
    url: `${SITE_URL}/tags`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: '태그 | ShipFriend TechBlog',
    description:
      'ShipFriend TechBlog의 태그 목록 페이지입니다. React, TypeScript, Next.js 등 개발 주제별 글을 탐색해보세요.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/tags`,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const TagsLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default TagsLayout;
