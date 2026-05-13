import { permanentRedirect, notFound } from 'next/navigation';
import dbConnect from '@/app/lib/dbConnect';
import Series from '@/app/models/Series';
import SeriesDetailClient from './SeriesDetailClient';

interface SeriesDetailPageProps {
  params: {
    slug: string;
  };
}

function isObjectId(str: string): boolean {
  return /^[a-f\d]{24}$/i.test(str);
}

const SeriesDetailPage = async ({ params }: SeriesDetailPageProps) => {
  if (isObjectId(params.slug)) {
    await dbConnect();
    const series = await Series.findById(params.slug, { slug: 1 }).lean() as { slug: string } | null;
    if (series?.slug) {
      permanentRedirect(`/series/${encodeURIComponent(series.slug)}`);
    }
    notFound();
  }

  return <SeriesDetailClient slug={params.slug} />;
};

export default SeriesDetailPage;
