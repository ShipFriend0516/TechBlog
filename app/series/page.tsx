'use client';
import React, { useEffect, useState } from 'react';
import { FaBookOpen, FaCalendar } from 'react-icons/fa';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import { Series } from '@/app/types/Series';

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
        <p className="text-slate-500 mt-2">Start creating your first series!</p>
      </div>
    );
  }

  return (
    <section className={'w-full p-10'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈</h1>
      <p className={'text-lg mb-4'}>시리즈별로 글을 확인해보세요.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((item) => (
          <div
            key={item.slug}
            className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-slate-200"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {item.thumbnailImage ? (
                <img
                  src={item.thumbnailImage}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <FaBookOpen className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <FaCalendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <FaBookOpen className="w-4 h-4" />
                  {item.posts.length || 0} posts
                </span>
              </div>

              <p className="text-sm text-slate-600 line-clamp-3">
                {item.description || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeriesListPage;
