import SeriesPreview from '@/app/entities/series/list/SeriesPreview';
import React, { useEffect, useState } from 'react';
import { Series } from '@/app/types/Series';
import { FaBookOpen } from 'react-icons/fa';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import SeriesGridSkeleton from '@/app/entities/common/Skeleton/SeriesGridSkeleton';

const SeriesList = () => {
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

  if (loading) return <SeriesGridSkeleton />;
  if (!loading && series.length === 0) return <NoSeriesFound />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((item) => (
        <SeriesPreview item={item} key={item.slug} />
      ))}
    </div>
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
