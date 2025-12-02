import { useState, useEffect } from 'react';

/**
 * Tailwind 그리드 브레이크포인트에 따른 열 개수를 반환하는 커스텀 훅
 * @returns 현재 화면 크기에 해당하는 그리드 열 개수 (1~4)
 */
const useGridColumns = () => {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) {
        setCols(4); // xl
      } else if (window.matchMedia('(min-width: 768px)').matches) {
        setCols(3); // md, lg
      } else if (window.matchMedia('(min-width: 640px)').matches) {
        setCols(2); // sm
      } else {
        setCols(1); // default
      }
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  return cols;
};

export default useGridColumns;
