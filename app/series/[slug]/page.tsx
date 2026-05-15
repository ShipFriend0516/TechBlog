import { permanentRedirect, notFound } from 'next/navigation';
import dbConnect from '@/app/lib/dbConnect';
import Series from '@/app/models/Series';
import '@/app/models/Post';
import type { SeriesDetail as SeriesDetailType } from '@/app/types/Series.d';
import SeriesDetail from '../../entities/series/detail/SeriesDetail';

export const revalidate = 3600;

interface SeriesDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function isObjectId(str: string): boolean {
  return /^[a-f\d]{24}$/i.test(str);
}

export async function generateStaticParams() {
  await dbConnect();
  const seriesList = (await Series.find({}, { slug: 1 }).lean()) as unknown as {
    slug: string;
  }[];
  return seriesList.map((s) => ({ slug: s.slug }));
}

const SeriesDetailPage = async (props: SeriesDetailPageProps) => {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  await dbConnect();

  if (isObjectId(slug)) {
    const found = (await Series.findById(slug, {
      slug: 1,
    }).lean()) as unknown as { slug: string } | null;
    if (found?.slug) {
      permanentRedirect(`/series/${encodeURIComponent(found.slug)}`);
    }
    notFound();
  }

  const raw = await Series.findOne({ slug })
    .populate({ path: 'posts', options: { sort: { date: 1 } } })
    .lean();

  if (!raw) notFound();

  const series = JSON.parse(JSON.stringify(raw)) as SeriesDetailType;

  return <SeriesDetail series={series} />;
};

export default SeriesDetailPage;
