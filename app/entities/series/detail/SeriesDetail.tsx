'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import SeriesDetailHeader from '@/app/entities/series/detail/SeriesDetailHeader';
import SeriesDetailPostList from '@/app/entities/series/detail/SeriesDetailPostList';
import { SeriesDetail as SeriesDetailType } from '@/app/types/Series.d';

interface SeriesDetailProps {
  series: SeriesDetailType;
}

const SeriesDetail = ({ series }: SeriesDetailProps) => {
  const [orderOption, setOrderOption] = useState<'latest' | 'oldest' | string>(
    'latest'
  );

  const posts =
    orderOption === 'latest' ? [...series.posts].reverse() : series.posts;

  return (
    <section>
      <div
        className={
          'relative flex flex-col justify-center gap-2 max-w-5xl mx-auto p-4 animate-popUp rounded-lg'
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
    </section>
  );
};

export default SeriesDetail;
