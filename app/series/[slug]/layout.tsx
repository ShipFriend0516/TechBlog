import type { Metadata } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import {
  absoluteUrl,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '@/app/lib/site';
import SeriesModel from '@/app/models/Series';
import { Series } from '@/app/types/Series';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
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
    const url = `${SITE_URL}/series/${encodeURIComponent(series.slug)}`;

    const images = series.thumbnailImage
      ? [{ url: absoluteUrl(series.thumbnailImage), alt: series.title }]
      : [
          {
            url: DEFAULT_SOCIAL_IMAGE,
            width: 1424,
            height: 752,
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
        siteName: SITE_NAME,
        images,
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images.map((image) => image.url),
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
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
