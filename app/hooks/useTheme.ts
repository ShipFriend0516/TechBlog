import useThemeStore from '@/app/stores/useThemeStore';

const useTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

export default useTheme;
