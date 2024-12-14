'use client';
import animation from '@/app/public/assets/loadingAnimation1.json';
import dynamic from 'next/dynamic';

interface LoadingIndicatorProps {
  message?: string;
}
const LoadingIndicator = ({ message }: LoadingIndicatorProps) => {
  const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

  return (
    <div>
      <Lottie animationData={animation} speed={0.7} loop play />
      {message && (
        <p className={'text-gray-400 text-center text-lg'}>{message}</p>
      )}
    </div>
  );
};

export default LoadingIndicator;
