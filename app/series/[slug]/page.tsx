import { permanentRedirect, notFound } from 'next/navigation';
import SeriesDetail from '@/app/entities/series/detail/SeriesDetail';
import dbConnect from '@/app/lib/dbConnect';
import { stripMarkdown } from '@/app/lib/utils/stripMarkdown';
import Series from '@/app/models/Series';
import '@/app/models/Post';
import type { SeriesDetail as SeriesDetailType } from '@/app/types/Series.d';

export const revalidate = 3600;

const EXCERPT_LENGTH = 120;

interface PopulatedPost {
  _id: string;
  slug: string;
  title: string;
  subTitle?: string;
  content?: string;
  date: number;
  timeToRead?: number;
  tags?: string[];
  thumbnailImage?: string;
}

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
    .populate({
      path: 'posts',
      match: {
        $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
      },
      // 본문은 미리보기 문구를 만들 때만 쓰고 클라이언트로는 보내지 않는다
      select: 'slug title subTitle content date timeToRead tags thumbnailImage',
      options: { sort: { date: 1 } },
    })
    .lean();

  if (!raw) notFound();

  const { posts, ...rest } = JSON.parse(JSON.stringify(raw)) as Omit<
    SeriesDetailType,
    'posts'
  > & { posts: PopulatedPost[] };

  const series: SeriesDetailType = {
    ...rest,
    posts: posts.map((post) => ({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      excerpt: post.subTitle
        ? stripMarkdown(post.subTitle, EXCERPT_LENGTH)
        : stripMarkdown(post.content ?? '', EXCERPT_LENGTH),
      date: post.date,
      timeToRead: post.timeToRead ?? 0,
      tags: post.tags ?? [],
      thumbnailImage: post.thumbnailImage || undefined,
    })),
  };

  return <SeriesDetail series={series} />;
};

export default SeriesDetailPage;
