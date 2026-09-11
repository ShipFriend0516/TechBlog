import type { Metadata } from 'next';
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '@/app/lib/site';

export const metadata: Metadata = {
  title: '시리즈 | ShipFriend TechBlog',
  description:
    '주제별로 정리된 시리즈 글 목록입니다. 관심 있는 시리즈를 선택해 순서대로 읽어보세요.',
  keywords: [
    'ShipFriend',
    '시리즈',
    '개발 시리즈',
    '기술 블로그 시리즈',
    'TechBlog',
  ],
  openGraph: {
    title: '시리즈 | ShipFriend TechBlog',
    description:
      '주제별로 정리된 시리즈 글 목록입니다. 관심 있는 시리즈를 선택해 순서대로 읽어보세요.',
    url: `${SITE_URL}/series`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: '시리즈 | ShipFriend TechBlog',
    description:
      '주제별로 정리된 시리즈 글 목록입니다. 관심 있는 시리즈를 선택해 순서대로 읽어보세요.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/series`,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const SeriesLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default SeriesLayout;
