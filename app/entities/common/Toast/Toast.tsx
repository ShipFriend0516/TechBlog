import React from 'react';
import { CiCircleCheck, CiCircleRemove, CiMail } from 'react-icons/ci';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  title?: string;
  type: ToastType;
  removeToast: () => void;
}

const iconMap: Record<ToastType, React.JSX.Element> = {
  success: <CiCircleCheck className="text-accent" size={40} />,
  error: <CiCircleRemove className="text-danger" size={40} />,
  info: <CiMail className="text-info" size={40} />,
};

const Toast = ({ message, title, type, removeToast }: ToastProps) => {
  return (
    <div
      onClick={() => removeToast()}
      className={`transform transition-all duration-300 ease-out animate-slideUp bg-raised/90 text-fg px-3 py-2 rounded-lg flex items-center gap-3 backdrop-blur-sm w-full max-w-md origin-center cursor-pointer hover:bg-fg/15 shadow-lg hover:shadow-lg `}
    >
      <div className={`flex items-center justify-center rounded-full p-0.5`}>
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className="text font-semibold text-sm">{title}</p>}
        <p
          className={`text whitespace-pre-line ${title ? 'text-xs text-fg-soft mt-0.5' : 'line-clamp-1'}`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default Toast;
