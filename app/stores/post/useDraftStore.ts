import { Post } from '@/app/types/Post';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DraftStoreState {
  draft: Partial<Post> | null;
  setDraft: (draft: Partial<Post> | null) => void;
}

const useDraftStore = create(
  persist<DraftStoreState>(
    (set) => ({
      draft: null,
      setDraft: (draft) => {
        set(() => ({ draft }));
      },
    }),
    {
      name: 'draft-storage',
    }
  )
);

export default useDraftStore;
