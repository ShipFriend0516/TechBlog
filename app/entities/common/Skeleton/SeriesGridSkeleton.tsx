import React from 'react';
import SeriesPreviewSkeleton from '@/app/entities/common/Skeleton/SeriesPreviewSkeleton';

const SeriesGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <SeriesPreviewSkeleton key={index} />
      ))}
    </div>
  );
};

export default SeriesGridSkeleton;
