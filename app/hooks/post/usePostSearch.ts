import { useState } from 'react';
import useSearchQueryStore from '@/app/stores/useSearchQueryStore';
import useDebounce from '@/app/hooks/optimize/useDebounce';

const usePostSearch = () => {
  const [query, setQuery] = useState('');
  const addLatestQuery = useSearchQueryStore((state) => state.addSearchQuery);
  const debouncedQuery = useDebounce(query, 300);

  return { query, setQuery, addLatestQuery, debouncedQuery };
};
export default usePostSearch;
