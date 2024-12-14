'use client';
import animation from '@/app/public/assets/loadingAnimation1.json';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

const LoadingIndicator = () => {
  return <Lottie animationData={animation} loop play />;
};

export default LoadingIndicator;
