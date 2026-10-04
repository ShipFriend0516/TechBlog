import Image from 'next/image';
import React from 'react';
import {
  FaBookOpen,
  FaCalendar,
  FaPen,
  FaTrash,
} from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { Series } from '@/app/types/Series';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

interface AdminSeriesListItemProps {
  series: Series;
  handleUpdateSeries: (series: Series) => void;
  handleDeleteClick: (slug: string) => void;
  dragHandleListeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
}

const AdminSeriesListItem = ({
  series,
  handleUpdateSeries,
  handleDeleteClick,
  dragHandleListeners,
  isDragging,
}: AdminSeriesListItemProps) => {
  const handleEditClick = () => handleUpdateSeries(series);
  const handleDeleteButtonClick = () => handleDeleteClick(series.slug);

  return (
    <div
      className={`group relative flex h-[180px] overflow-hidden rounded-2xl bg-surface shadow-sm transition-all duration-200 ${
 isDragging
 ? 'border-accent/60 shadow-xl ring-2 ring-accent/30'
 : 'hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg '
 }`}
    >
      {dragHandleListeners && (
        <div
          {...dragHandleListeners}
          className="flex w-8 flex-shrink-0 cursor-grab items-center justify-center border-r border-hairline bg-surface text-fg-faint transition-colors hover:bg-raised hover:text-fg-muted active:cursor-grabbing"
        >
          <MdDragIndicator className="h-5 w-5" />
        </div>
      )}

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
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-subtle to-accent-subtle">
            <FaBookOpen className="h-12 w-12 text-accent-strong" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-black/0 transition-opacity duration-300 group-hover:to-black/10" />
      </div>

      <div className="flex w-full min-w-0 flex-col p-5">
        <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-fg transition-colors group-hover:text-accent">
          {series.title}
        </h3>

        <div className="mb-3 flex items-center gap-4 text-sm text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <FaCalendar className="h-3.5 w-3.5" />
            {new Date(series.date).toLocaleDateString('ko-KR')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaBookOpen className="h-3.5 w-3.5" />
            {series.posts.length || 0} posts
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-fg-soft">
          {series.description || '설명이 없습니다.'}
        </p>

        <div className={'mt-auto flex items-center justify-end gap-2 pt-3'}>
          <button
            onClick={handleEditClick}
            className={
              'inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:bg-accent-subtle hover:text-accent-strong '
            }
          >
            <FaPen className="h-3 w-3" />
            수정
          </button>
          <button
            onClick={handleDeleteButtonClick}
            className={
              'inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300'
            }
          >
            <FaTrash className="h-3 w-3" />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminSeriesListItem);
