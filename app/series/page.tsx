'use client';
import React, { useEffect, useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import { Series } from '@/app/types/Series';
import SeriesPreview from '@/app/entities/series/list/SeriesPreview';

const SeriesListPage = () => {
  const [series, setSeries] = useState<Series[]>([]);

  const getSeries = async () => {
    const data = await getAllSeriesData();
    setSeries(data);
  };

  useEffect(() => {
    getSeries();
  }, []);

  if (!series || series.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FaBookOpen className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700">
          No Series Found
        </h3>
      </div>
    );
  }

  return (
    <section className={'w-full p-10'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈</h1>
      <p className={'text-lg mb-4'}>시리즈별로 글을 확인해보세요.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((item) => (
          <SeriesPreview item={item} key={item.slug} />
        ))}
      </div>
    </section>
  );
};

export default SeriesListPage;
