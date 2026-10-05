'use client';

import { FiRotateCcw, FiX } from 'react-icons/fi';
import PostSearchInput from '@/app/entities/post/list/PostSearchInput';
import SeriesFilter from '@/app/entities/post/list/SeriesFilter';
import TagFilter from '@/app/entities/post/list/TagFilter';
import { Series } from '@/app/types/Series';
import { TagData } from '@/app/types/Tag';

interface SearchSectionProps {
  query: string;
  setQuery: (query: string) => void;
  searchSeries: string;
  searchTag: string;
  series: Series[];
  tags: TagData[];
  totalPosts: number;
  loading: boolean;
  onSelectSeries: (slug: string) => void;
  onSelectTag: (tag: string) => void;
  resetSearchCondition: () => void;
}

interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

const SearchSection = ({
  query,
  setQuery,
  searchSeries,
  searchTag,
  series,
  tags,
  totalPosts,
  loading,
  onSelectSeries,
  onSelectTag,
  resetSearchCondition,
}: SearchSectionProps) => {
  const trimmedQuery = query.trim();
  const seriesTitle =
    series.find((s) => s.slug === searchSeries)?.title ?? searchSeries;

  const activeFilters: ActiveFilter[] = [
    ...(trimmedQuery
      ? [{ key: 'query', label: `"${trimmedQuery}"`, onRemove: () => setQuery('') }]
      : []),
    ...(searchSeries
      ? [{ key: 'series', label: seriesTitle, onRemove: () => onSelectSeries('') }]
      : []),
    ...(searchTag
      ? [{ key: 'tag', label: `#${searchTag}`, onRemove: () => onSelectTag('') }]
      : []),
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <PostSearchInput value={query} onChange={setQuery} />
        <SeriesFilter
          series={series}
          selected={searchSeries}
          onSelect={onSelectSeries}
        />
      </div>

      <TagFilter tags={tags} selected={searchTag} onSelect={onSelectTag} />

      <div className="flex flex-wrap items-center gap-2 min-h-8 pt-1 text-sm">
        <p className="text-fg-muted" aria-live="polite">
          {loading ? (
            '검색 중...'
          ) : (
            <>
              <b className="font-semibold text-fg">{totalPosts}</b>개의 글
            </>
          )}
        </p>

        {activeFilters.length > 0 && (
          <>
            <span aria-hidden className="h-4 w-px bg-hairline" />
            <ul className="flex flex-wrap items-center gap-1.5">
              {activeFilters.map((filter) => (
                <li key={filter.key}>
                  <button
                    type="button"
                    onClick={filter.onRemove}
                    aria-label={`${filter.label} 필터 해제`}
                    className="group inline-flex max-w-60 items-center gap-1 rounded-md border border-hairline bg-surface pl-2 pr-1 py-0.5 text-fg-soft hover:border-accent/40 hover:text-fg transition-colors"
                  >
                    <span className="truncate">{filter.label}</span>
                    <FiX
                      size={14}
                      aria-hidden
                      className="flex-shrink-0 text-fg-faint group-hover:text-fg"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={resetSearchCondition}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-fg-muted hover:text-accent transition-colors"
            >
              <FiRotateCcw size={13} aria-hidden />
              초기화
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
