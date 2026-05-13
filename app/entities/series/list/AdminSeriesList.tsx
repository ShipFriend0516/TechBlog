import React from 'react';
import { FaBookOpen } from 'react-icons/fa';
import AdminSeriesListItem from '@/app/entities/series/list/AdminSeriesListItem';
import { Series } from '@/app/types/Series';

interface AdminSeriesListProps {
  seriesList: Series[] | null | undefined;
  loading: boolean;
  handleUpdateSeries: (series: Series) => void;
  handleDeleteClick: (slug: string) => void;
}

const SkeletonItem = () => (
  <li className="flex h-[180px] animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-card-light dark:border-neutral-700 dark:bg-card-dark">
    <div className="h-full w-[260px] flex-shrink-0 bg-neutral-200 dark:bg-neutral-700" />
    <div className="flex w-full flex-col gap-3 p-5">
      <div className="h-5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  </li>
);

const AdminSeriesList = ({
  loading,
  seriesList,
  handleUpdateSeries,
  handleDeleteClick,
}: AdminSeriesListProps) => {
  if (loading) {
    return (
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonItem key={index} />
        ))}
      </ul>
    );
  }

  if (!seriesList || seriesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <FaBookOpen className="h-7 w-7 text-neutral-400" />
        </div>
        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
          등록된 시리즈가 없습니다.
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          위의 &lsquo;시리즈 추가&rsquo; 버튼을 눌러 첫 시리즈를 만들어보세요.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {seriesList.map((series) => (
        <AdminSeriesListItem
          key={series._id}
          series={series}
          handleUpdateSeries={handleUpdateSeries}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </ul>
  );
};

export default AdminSeriesList;
