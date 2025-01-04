import useThemeStore from '@/app/stores/useThemeStore';
import { useEffect } from 'react';

const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
