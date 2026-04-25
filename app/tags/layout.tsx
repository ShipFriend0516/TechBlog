import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '태그 | ShipFriend TechBlog',
  description:
    '블로그에서 사용된 태그들을 빠르게 탐색할 수 있습니다. 관심 있는 태그를 선택해 관련 글을 찾아보세요.',
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
      '블로그에서 사용된 태그들을 빠르게 탐색할 수 있습니다. 관심 있는 태그를 선택해 관련 글을 찾아보세요.',
    url:
      (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev') +
      '/tags',
    siteName: 'ShipFriend TechBlog',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: '/tags',
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const TagsLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default TagsLayout;
