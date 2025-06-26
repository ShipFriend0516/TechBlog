'use client';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import SeriesDetailHeader from '@/app/entities/series/detail/SeriesDetailHeader';
import SeriesDetailPostList from '@/app/entities/series/detail/SeriesDetailPostList';

interface SeriesDetailPageProps {
  params: {
    slug: string;
  };
}

const SeriesDetailPage = ({ params }: SeriesDetailPageProps) => {
  const [orderOption, setOrderOption] = useState<'latest' | 'oldest' | string>(
    'latest'
  );

  const getSeriesDetailConfig: useDataFetchConfig = {
    url: `/api/series/${params.slug}`,
    method: 'GET',
  };

  const { data: series, loading, error } = useDataFetch(getSeriesDetailConfig);
  const posts =
    loading || !series?.posts
      ? []
      : orderOption === 'latest'
        ? series.posts?.toReversed()
        : series.posts;

  return (
    <section>
      {loading && <SVGLoadingSpinner />}
      <ErrorBox error={error} />

      {series && (
        <div
          className={
            'relative flex flex-col justify-center gap-2 max-w-5xl mx-auto p-4 animate-popUp  rounded-lg'
          }
        >
          <Link
            href={'/series'}
            className={
              'inline-flex items-center justify-start gap-2 mb-4 hover:underline hover:font-bold cursor-pointer'
            }
          >
            <FaArrowLeft /> 시리즈 목록으로 돌아가기
          </Link>
          <SeriesDetailHeader series={series} />
          <SeriesDetailPostList
            series={series}
            posts={posts}
            setOrderOption={setOrderOption}
            orderOption={orderOption}
          />
        </div>
      )}
    </section>
  );
};

export default SeriesDetailPage;
