import { create } from 'zustand';

interface SearchQueryState {
  latestSearchQueries: string[];
  addSearchQuery: (searchQuery: string) => void;
}
const searchQueryStore = create<SearchQueryState>((set) => ({
  latestSearchQueries: [],
  addSearchQuery: (searchQuery: string) => {
    set((state: SearchQueryState) => {
      const deduped = state.latestSearchQueries.filter((q) => q !== searchQuery);
      return {
        latestSearchQueries: [searchQuery, ...deduped].slice(0, 10),
      };
    });
  },
}));

export default searchQueryStore;
