'use client';

import React, { useEffect, useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import SeriesGridSkeleton from '@/app/entities/common/Skeleton/SeriesGridSkeleton';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import SeriesPreview from '@/app/entities/series/list/SeriesPreview';
import useGridColumns from '@/app/hooks/common/useGridColumns';
import { Series } from '@/app/types/Series';

const SeriesList = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const cols = useGridColumns();

  const getSeries = async () => {
    const data = await getAllSeriesData();
    setSeries(data);
    setLoading(false);
  };

  useEffect(() => {
    getSeries();
  }, []);

  if (loading) return <SeriesGridSkeleton />;
  if (!loading && series.length === 0) return <NoSeriesFound />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((item, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const diagonalIndex = row + col;
        const delay = diagonalIndex * 0.1;

        return (
          <li
            key={item.slug}
            className="opacity-0 translate-y-5 animate-popUp"
            style={{
              animationDelay: `${delay}s`,
              animationFillMode: 'forwards',
            }}
          >
            <SeriesPreview item={item} />
          </li>
        );
      })}
    </ul>
  );
};

const NoSeriesFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FaBookOpen className="w-12 h-12 text-slate-400 mb-4" />
      <h3 className="text-xl font-semibold text-slate-700">No Series Found</h3>
    </div>
  );
};

export default SeriesList;
