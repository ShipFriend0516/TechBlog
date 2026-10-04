import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface LoadingSpinnerProps {
  content?: string;
  size?: number;
}

const LoadingSpinner = ({ content, size }: LoadingSpinnerProps) => {
  return (
    <div className="text-accent" role="status">
      <AiOutlineLoading3Quarters
        className={'animate-spin'}
        style={{ fontSize: size }}
      />
      <span className="hidden">{content ? content : 'Loading...'}</span>
    </div>
  );
};

export default LoadingSpinner;
