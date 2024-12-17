import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface LoadingSpinnerProps {
  content?: string;
}

const LoadingSpinner = ({ content }: LoadingSpinnerProps) => {
  return (
    <div className=" text-primary" role="status">
      <AiOutlineLoading3Quarters className={'animate-spin '} />
      <span className="hidden">{content ? content : 'Loading...'}</span>
    </div>
  );
};

export default LoadingSpinner;
