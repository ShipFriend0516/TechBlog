import Image from 'next/image';
import React from 'react';
import { FaBookOpen, FaCalendar, FaPen, FaTrash } from 'react-icons/fa';
import { Series } from '@/app/types/Series';

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
        'group relative flex h-[180px] overflow-hidden rounded-2xl border border-neutral-200 bg-card-light shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-secondary/40 hover:shadow-lg dark:border-neutral-700 dark:bg-card-dark'
      }
    >
      <div className={'relative h-full w-[260px] flex-shrink-0 overflow-hidden'}>
        {series.thumbnailImage ? (
          <Image
            width={300}
            height={200}
            src={series.thumbnailImage}
            alt={series.title}
            loading={'lazy'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-neutral-800 dark:to-neutral-700">
            <FaBookOpen className="h-12 w-12 text-emerald-300 dark:text-neutral-500" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-black/0 transition-opacity duration-300 group-hover:to-black/10" />
      </div>

      <div className="flex w-full min-w-0 flex-col p-5">
        <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-default transition-colors group-hover:text-brand-secondary">
          {series.title}
        </h3>

        <div className="mb-3 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <FaCalendar className="h-3.5 w-3.5" />
            {new Date(series.date).toLocaleDateString('ko-KR')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaBookOpen className="h-3.5 w-3.5" />
            {series.posts.length || 0} posts
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
          {series.description || '설명이 없습니다.'}
        </p>

        <div className={'mt-auto flex items-center justify-end gap-2 pt-3'}>
          <button
            onClick={() => handleUpdateSeries(series)}
            className={
              'inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300'
            }
          >
            <FaPen className="h-3 w-3" />
            수정
          </button>
          <button
            onClick={() => handleDeleteClick(series.slug)}
            className={
              'inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300'
            }
          >
            <FaTrash className="h-3 w-3" />
            삭제
          </button>
        </div>
      </div>
    </li>
  );
};

export default AdminSeriesListItem;
