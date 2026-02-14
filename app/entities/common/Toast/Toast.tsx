import { CiCircleCheck, CiCircleRemove, CiMail } from 'react-icons/ci';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  title?: string;
  type: ToastType;
  removeToast: () => void;
}

const iconMap: Record<ToastType, JSX.Element> = {
  success: <CiCircleCheck color={'green'} size={40} />,
  error: <CiCircleRemove color={'red'} size={40} />,
  info: <CiMail color={'#3b82f6'} size={40} />,
};

const Toast = ({ message, title, type, removeToast }: ToastProps) => {
  return (
    <div
      onClick={() => removeToast()}
      className={`
          transform transition-all duration-300 ease-out animate-slideUp
          bg-gray-200/90 text-black px-3 py-2 rounded-lg flex items-center gap-3
          backdrop-blur-sm w-full max-w-md origin-center cursor-pointer
          hover:bg-gray-300/90 hover:shadow-lg
        `}
    >
      <div className={`flex items-center justify-center rounded-full p-0.5`}>
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text font-semibold text-sm">{title}</p>
        )}
        <p className={`text whitespace-pre-line ${title ? 'text-xs text-gray-600 mt-0.5' : 'line-clamp-1'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Toast;
