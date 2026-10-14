'use client';

import { useState } from 'react';
import SeriesPostItem from '@/app/entities/series/detail/SeriesPostItem';
import { SeriesPostSummary } from '@/app/types/Series';

type Order = 'oldest' | 'latest';

const ORDER_OPTIONS: { value: Order; label: string }[] = [
  { value: 'oldest', label: '1편부터' },
  { value: 'latest', label: '최신부터' },
];

interface SeriesDetailPostListProps {
  // 작성일 오름차순 — 회차 번호의 기준
  posts: SeriesPostSummary[];
}

const SeriesDetailPostList = ({ posts }: SeriesDetailPostListProps) => {
  const [order, setOrder] = useState<Order>('oldest');

  const numbered = posts.map((post, index) => ({ post, number: index + 1 }));
  const ordered = order === 'oldest' ? numbered : [...numbered].reverse();

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          목차 <span className="text-fg-muted font-normal">{posts.length}</span>
        </h2>
        {posts.length > 1 && (
          <div
            role="group"
            aria-label="정렬"
            className="inline-flex rounded-full bg-surface p-1 text-sm"
          >
            {ORDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={order === option.value}
                onClick={() => setOrder(option.value)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  order === option.value
                    ? 'bg-raised text-fg font-medium'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {posts.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {ordered.map(({ post, number }) => (
            <SeriesPostItem key={post._id} post={post} number={number} />
          ))}
        </ol>
      ) : (
        <p className="rounded-card bg-surface py-10 text-center text-sm text-fg-muted">
          이 시리즈에는 아직 공개된 글이 없습니다.
        </p>
      )}
    </section>
  );
};

export default SeriesDetailPostList;
