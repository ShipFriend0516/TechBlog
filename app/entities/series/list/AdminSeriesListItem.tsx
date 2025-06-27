import { Series } from '@/app/types/Series';
import Image from 'next/image';
import { FaBookOpen, FaCalendar } from 'react-icons/fa';
import React from 'react';

interface AdminSeriesListItemProps {
  series: Series;
  handleUpdateSeries: (series: Series) => void;
  handleDeleteClick: (slug: string) => void;
}

const AdminSeriesListItem = ({
  series,
  handleUpdateSeries,
  handleDeleteClick,
}: AdminSeriesListItemProps) => {
  return (
    <li
      className={
        'h-[160px] bg-neutral-100/80 flex rounded-2xl overflow-hidden shadow-lg mb-4'
      }
    >
      <div className={'w-[300px]'}>
        {series.thumbnailImage ? (
          <Image
            width={300}
            height={200}
            src={series.thumbnailImage}
            alt={series.title}
            loading={'lazy'}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <FaBookOpen className="w-12 h-12 text-slate-400" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col w-full">
        <h3 className="text-default text-xl font-semibold mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {series.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <FaCalendar className="w-4 h-4" />
            {new Date(series.date).toLocaleDateString()}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <FaBookOpen className="w-4 h-4" />
            {series.posts.length || 0} posts
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {series.description || 'No description available'}
        </p>
        <ul className={'flex flex-grow items-end gap-2 w-full  justify-start '}>
          <button
            onClick={() => handleUpdateSeries(series)}
            className={'bg-green-200 rounded-2xl cursor-pointer px-4'}
          >
            시리즈 수정
          </button>
          <button
            onClick={() => handleDeleteClick(series.slug)}
            disabled={true}
            className={
              'disabled:bg-neutral-200 disabled:cursor-not-allowed bg-red-200 rounded-2xl cursor-pointer px-4'
            }
          >
            시리즈 삭제
          </button>
        </ul>
      </div>
    </li>
  );
};

export default AdminSeriesListItem;
