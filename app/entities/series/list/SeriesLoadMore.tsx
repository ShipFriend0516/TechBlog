'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SeriesListEntry from '@/app/entities/series/list/SeriesListEntry';
import type { SeriesListItem, SeriesPage } from '@/app/types/Series.d';

interface SeriesLoadMoreProps {
  initialCursor: string;
  initialCount: number;
  initialIds: string[];
}

export default function SeriesLoadMore({
  initialCursor,
  initialCount,
  initialIds,
}: SeriesLoadMoreProps) {
  const [items, setItems] = useState<SeriesListItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const inFlightRef = useRef(false);
  const loadedIdsRef = useRef(new Set(initialIds));

  const loadMore = useCallback(async () => {
    if (!cursor || inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(
        `/api/series/public?cursor=${encodeURIComponent(cursor)}`,
        {
          cache: 'no-store',
        }
      );
      if (!response.ok)
        throw new Error(`Series request failed: ${response.status}`);

      const page = (await response.json()) as SeriesPage;
      const newItems = page.items.filter((item) => {
        if (loadedIdsRef.current.has(item._id)) return false;
        loadedIdsRef.current.add(item._id);
        return true;
      });
      setItems((previous) => [...previous, ...newItems]);
      setCursor(page.nextCursor);
    } catch (cause) {
      console.error('시리즈 목록 추가 조회 실패', cause);
      setError(true);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [cursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !cursor || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, error, loadMore]);

  return (
    <>
      {items.map((item, index) => (
        <SeriesListEntry
          key={item._id}
          item={item}
          index={initialCount + index}
        />
      ))}
      {cursor && (
        <li
          ref={sentinelRef}
          className="col-span-full flex justify-center py-6"
          aria-live="polite"
        >
          {error ? (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              시리즈를 불러오지 못했습니다. 다시 시도
            </button>
          ) : (
            <span className="text-sm text-weak">
              {loading ? '시리즈를 불러오는 중...' : '더 많은 시리즈 불러오기'}
            </span>
          )}
        </li>
      )}
    </>
  );
}
