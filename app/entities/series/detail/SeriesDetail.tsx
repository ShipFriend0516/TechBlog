import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SeriesDetailHeader from '@/app/entities/series/detail/SeriesDetailHeader';
import SeriesDetailPostList from '@/app/entities/series/detail/SeriesDetailPostList';
import { SeriesDetail as SeriesDetailType } from '@/app/types/Series.d';

interface SeriesDetailProps {
  series: SeriesDetailType;
}

const SeriesDetail = ({ series }: SeriesDetailProps) => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-16">
      <Link
        href="/series"
        className="mt-10 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent"
      >
        <FiArrowLeft aria-hidden />
        모든 시리즈
      </Link>
      <SeriesDetailHeader series={series} />
      <SeriesDetailPostList posts={series.posts} />
    </section>
  );
};

export default SeriesDetail;
