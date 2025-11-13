import { useEffect } from 'react';
import useThemeStore from '@/app/stores/useThemeStore';

const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
