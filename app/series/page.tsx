'use client';
import React, { Suspense } from 'react';
import SeriesList from '@/app/entities/series/list/SeriesList';
import SeriesGridSkeleton from '@/app/entities/common/Skeleton/SeriesGridSkeleton';

const SeriesListPage = () => {
  return (
    <section className={'w-full p-4 max-w-5xl mx-auto'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈</h1>
      <p className={'text-lg text-weak mb-4'}>
        시리즈별로 글을 확인해보세요. 클릭시 세부 페이지로 이동합니다.
      </p>
      <SeriesList />
    </section>
  );
};

export default SeriesListPage;
