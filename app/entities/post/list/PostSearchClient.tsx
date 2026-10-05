'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Pagination from '@/app/entities/common/Pagination';
import PostList from '@/app/entities/post/list/PostList';
import SearchSection from '@/app/entities/post/list/SearchSection';
import useDebounce from '@/app/hooks/optimize/useDebounce';
import searchQueryStore from '@/app/stores/useSearchQueryStore';
import { Post } from '@/app/types/Post.d';
import { Series } from '@/app/types/Series.d';
import { TagData } from '@/app/types/Tag';

interface PostSearchClientProps {
  initialQuery: string;
  series: Series[];
  tags: TagData[];
  searchSeries: string;
  searchTag: string;
  initialPosts: Post[];
  totalPosts: number;
  currentPage: number;
  itemsPerPage: number;
}

interface Filters {
  query: string;
  series: string;
  tag: string;
}

const PostSearchClient = ({
  initialQuery,
  series,
  tags,
  searchSeries,
  searchTag,
  initialPosts,
  totalPosts,
  currentPage,
  itemsPerPage,
}: PostSearchClientProps) => {
  const router = useRouter();
  const addLatestQuery = searchQueryStore((state) => state.addSearchQuery);
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  // 필터 조합을 URL로 반영 (페이지는 1로 초기화) → 서버 컴포넌트가 다시 조회
  const navigate = (next: Partial<Filters>, mode: 'push' | 'replace' = 'push') => {
    const merged: Filters = {
      query: query.trim(),
      series: searchSeries,
      tag: searchTag,
      ...next,
    };

    const params = new URLSearchParams();
    if (merged.query) params.set('query', merged.query);
    if (merged.series) params.set('series', merged.series);
    if (merged.tag) params.set('tag', merged.tag);

    const href = params.size ? `/posts?${params.toString()}` : '/posts';
    startTransition(() => {
      router[mode](href, { scroll: false });
    });
  };

  // 디바운스된 검색어가 URL과 달라졌을 때만 동기화
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed === initialQuery) return;

    if (trimmed) addLatestQuery(trimmed);
    navigate({ query: trimmed }, 'replace');
  }, [debouncedQuery]);

  const handleResetSearchCondition = () => {
    setQuery('');
    navigate({ query: '', series: '', tag: '' });
  };

  return (
    <>
      <SearchSection
        query={query}
        setQuery={setQuery}
        searchSeries={searchSeries}
        searchTag={searchTag}
        series={series}
        tags={tags}
        totalPosts={totalPosts}
        loading={isPending}
        onSelectSeries={(slug) => navigate({ series: slug })}
        onSelectTag={(tag) => navigate({ tag })}
        resetSearchCondition={handleResetSearchCondition}
      />
      <PostList
        query={initialQuery}
        loading={isPending}
        posts={initialPosts}
        resetSearchCondition={handleResetSearchCondition}
      />
      <Pagination
        totalItems={totalPosts}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default PostSearchClient;
