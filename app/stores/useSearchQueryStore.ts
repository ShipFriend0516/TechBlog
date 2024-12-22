import { create } from 'zustand';

interface SearchQueryState {
  latestSearchQueries: string[];
  addSearchQuery: (searchQuery: string) => void;
}
const searchQueryStore = create<SearchQueryState>((set) => ({
  latestSearchQueries: [],
  addSearchQuery: (searchQuery: string) => {
    set((state: SearchQueryState) => {
      return {
        latestSearchQueries: [searchQuery, ...state.latestSearchQueries],
      };
    });
  },
}));

export default searchQueryStore;
