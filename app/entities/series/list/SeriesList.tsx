import SeriesPreviewSkeleton from '@/app/entities/common/Skeleton/SeriesPreviewSkeleton';
import SeriesPreview from '@/app/entities/series/list/SeriesPreview';
import React from 'react';
import { Series } from '@/app/types/Series';
import { FaBookOpen } from 'react-icons/fa';

interface SeriesListProps {
  series: Series[];
  loading: boolean;
}

const SeriesList = ({ series, loading }: SeriesListProps) => {
  if (!loading && series.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SeriesPreviewSkeleton key={index} />
          ))
        : series.map((item) => <SeriesPreview item={item} key={item.slug} />)}
    </div>
  );
};

export default SeriesList;
