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
      document.documentElement.style.backgroundColor = '#060a09';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f2f5f4';
    }
  }, [theme]);

  return { theme, toggleTheme };
};

export default useTheme;
