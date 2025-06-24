'use client';
import React, { useEffect, useState } from 'react';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import { Series } from '@/app/types/Series';
import SeriesList from '@/app/entities/series/list/SeriesList';

const SeriesListPage = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  const getSeries = async () => {
    const data = await getAllSeriesData();
    setSeries(data);
    setLoading(false);
  };

  useEffect(() => {
    getSeries();
  }, []);

  return (
    <section className={'w-full p-4 max-w-5xl mx-auto'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈</h1>
      <p className={'text-lg text-weak mb-4'}>
        시리즈별로 글을 확인해보세요. 클릭시 세부 페이지로 이동합니다.
      </p>
      <SeriesList series={series} loading={loading} />
    </section>
  );
};

export default SeriesListPage;
