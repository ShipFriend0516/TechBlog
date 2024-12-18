'use client';
import { useEffect, useRef } from 'react';

interface ProgressBarProps {
  duration: number;
}

const ProgressBar = ({ duration }: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBar = progressRef.current;
    if (progressBar) {
      progressBar.style.animation = `expand ${duration}ms linear`;
    }
  }, [duration]);

  return (
    <div className={'absolute left-0 bottom-0 h-1 z-50  progressBar w-full'}>
      <div
        ref={progressRef}
        className={'expand w-full origin-left bg-gray-50 h-full'}
        aria-label={'프로그레스바 진행'}
      ></div>
    </div>
  );
};

export default ProgressBar;
