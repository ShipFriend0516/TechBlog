import Lottie from 'lottie-react';
import animation from '@/app/public/assets/loadingAnimation1.json';

const LoadingIndicator = () => {
  return <Lottie animationData={animation} loop autoplay />;
};

export default LoadingIndicator;
