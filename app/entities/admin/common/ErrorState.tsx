import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl bg-surface px-6 py-10 text-center"
    >
      <FiAlertCircle size={28} className="text-danger" />
      <p className="text-sm text-fg-soft">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-1.5 text-sm font-medium text-fg hover:bg-raised/70 transition-colors"
        >
          <FiRefreshCw size={14} />
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorState;
