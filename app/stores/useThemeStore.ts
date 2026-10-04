import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      theme: 'dark',
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
