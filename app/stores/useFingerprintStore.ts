import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface FingerprintState {
  fingerprint: string;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

const useFingerprintStore = create(
  persist<FingerprintState>(
    (set, get) => ({
      fingerprint: '',
      isLoading: true,
      error: null,
      initialize: async () => {
        if (get().fingerprint) {
          set({ isLoading: false });
          return;
        }

        try {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          const visitorId = result.visitorId;

          set({
            fingerprint: visitorId,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '알 수 없는 오류',
            isLoading: false,
          });
          console.error('Fingerprint 생성 오류:', error);
        }
      },
    }),
    {
      name: 'fingerprint-storage',
    }
  )
);
export default useFingerprintStore;
