import { Metadata } from 'next';
import { SITE_URL } from '@/app/lib/site';
import AtelierClientLayout from './AtelierClientLayout';

export const metadata: Metadata = {
  title: 'Atelier - ShipFriend TechBlog',
  description: '생각들을 던져두는 곳, Atelier 페이지입니다.',
  openGraph: {
    title: 'Atelier - ShipFriend TechBlog',
    description: '생각들을 던져두는 곳, Atelier 페이지입니다.',
    url: `${SITE_URL}/atelier`,
    siteName: 'ShipFriend TechBlog',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/atelier/atelier-og-thumbnail.webp`,
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
    images: [`${SITE_URL}/images/atelier/atelier-og-thumbnail.webp`],
  },
  alternates: {
    canonical: `${SITE_URL}/atelier`,
  },
};

interface AtelierLayoutProps {
  children: React.ReactNode;
}

const AtelierLayout = ({ children }: AtelierLayoutProps) => {
  return <AtelierClientLayout>{children}</AtelierClientLayout>;
};

export default AtelierLayout;
