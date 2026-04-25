import type { Metadata } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import SeriesModel from '@/app/models/Series';
import { Series } from '@/app/types/Series';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://shipfriend.dev';

  try {
    await dbConnect();
    const slug = decodeURIComponent(params.slug);
    const series = (await SeriesModel.findOne({
      slug,
    }).lean()) as Series | null;

    if (!series) {
      return {
        title: '시리즈 | ShipFriend TechBlog',
        description: '시리즈 글 목록입니다.',
      };
    }

    const title = `${series.title} | ShipFriend TechBlog`;
    const description =
      series.description ||
      `${series.title} 시리즈의 글 목록입니다. ShipFriend TechBlog에서 연재되는 시리즈입니다.`;
    const url = `${baseUrl}/series/${params.slug}`;

    const images = series.thumbnailImage
      ? [{ url: series.thumbnailImage, alt: series.title }]
      : [
          {
            url: `${baseUrl}/images/profile/profile-banner.png`,
            width: 512,
            height: 512,
            alt: 'ShipFriend TechBlog',
          },
        ];

    return {
      title,
      description,
      keywords: [
        series.title,
        '시리즈',
        'ShipFriend',
        'TechBlog',
        '개발 블로그',
      ],
      openGraph: {
        title,
        description,
        url,
        siteName: 'ShipFriend TechBlog',
        images,
        locale: 'ko_KR',
        type: 'website',
      },
      alternates: {
        canonical: `/series/${params.slug}`,
      },
    };
  } catch (error) {
    return {
      title: '시리즈 | ShipFriend TechBlog',
      description: '시리즈 글 목록입니다.',
    };
  }
}

const SeriesDetailLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default SeriesDetailLayout;
