import React from 'react';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

const SeriesPreviewSkeleton = () => {
  const darkmodeStyle = `dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800`;
  const lightmodeStyle = `bg-white border-slate-200`;

  return (
    <div
      className={`rounded-lg shadow-sm overflow-hidden border ${lightmodeStyle} ${darkmodeStyle}`}
    >
      {/* 썸네일 스켈레톤 */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="p-5">
        {/* 제목 스켈레톤 */}
        <div className="mb-2">
          <Skeleton className="h-6 w-3/5 mb-2" />
        </div>

        {/* 날짜와 포스트 수 스켈레톤 */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-3 w-24" />
          <div className="ml-auto">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* 설명 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default SeriesPreviewSkeleton;
