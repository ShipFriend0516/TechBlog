import { create } from 'zustand';

interface SearchQueryState {
  latestSearchQueries: string[];
  setSearchQuery: (searchQuery: string) => void;
}
const useSearchQueryStore = () => {
  const searchQueryStore = create((set) => ({
    latestSearchQueries: [],
  }));

  const addSearchQuery = (searchQuery: string) => {
    searchQueryStore.setState((state: SearchQueryState) => {
      return {
        latestSearchQueries: [searchQuery, ...state.latestSearchQueries],
      };
    });
  };

  return { searchQueryStore, addSearchQuery };
};

export default useSearchQueryStore;
