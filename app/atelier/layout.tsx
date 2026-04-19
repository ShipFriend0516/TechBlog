import { Metadata } from 'next';
import AtelierClientLayout from './AtelierClientLayout';

export const metadata: Metadata = {
  title: 'Atelier - ShipFriend TechBlog',
  description: '생각들을 던져두는 곳, Atelier 페이지입니다.',
  openGraph: {
    title: 'Atelier - ShipFriend TechBlog',
    description: '생각들을 던져두는 곳, Atelier 페이지입니다.',
    url: 'https://shipfriend.dev/atelier',
    siteName: 'ShipFriend TechBlog',
    type: 'website',
    images: [
      {
        url: 'https://shipfriend.dev/images/atelier/atelier-og-thumbnail.webp',
        width: 1200,
        height: 630,
        alt: 'Atelier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier - ShipFriend TechBlog',
    description: '생각들을 던져두는 곳, Atelier 페이지입니다.',
    images: ['https://shipfriend.dev/images/atelier/atelier-og-thumbnail.webp'],
  },
};

interface AtelierLayoutProps {
  children: React.ReactNode;
}

const AtelierLayout = ({ children }: AtelierLayoutProps) => {
  return <AtelierClientLayout>{children}</AtelierClientLayout>;
};

export default AtelierLayout;
