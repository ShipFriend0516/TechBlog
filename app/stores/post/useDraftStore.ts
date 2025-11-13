import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post } from '@/app/types/Post';

interface DraftStoreState {
  draft: Partial<Post> | null;
  setDraft: (draft: Partial<Post> | null, uploadedImages?: string[]) => void;
  uploadedImages: string[];
}

const useDraftStore = create(
  persist<DraftStoreState>(
    (set) => ({
      draft: null,
      uploadedImages: [],
      setDraft: (draft, uploadedImages) => {
        set(() => ({ draft, uploadedImages: uploadedImages || [] }));
      },
    }),
    {
      name: 'draft-storage',
    }
  )
);

export default useDraftStore;
