'use client';
import dynamic from 'next/dynamic';
import type { LottieProps } from 'react-lottie-player';

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const LottiePlayer = ({ ...props }: LottieProps) => {
  return <Lottie {...props} />;
};

export default LottiePlayer;
