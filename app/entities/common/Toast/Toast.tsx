import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  removeToast: () => void;
}

const Toast = ({ message, type, removeToast }: ToastProps) => {
  const iconRender = (type: 'success' | 'error') => {
    if (type === 'success') {
      return <CiCircleCheck size={32} />;
    } else {
      return <CiCircleRemove size={32} />;
    }
  };
  const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div
        className={`
          transform transition-all duration-300 ease-out animate-slideUp
          bg-gray-200/90 text-black px-4 py-3 rounded-lg flex items-center gap-3 
          backdrop-blur-sm w-full max-w-md
        `}
      >
        <div className={`${backgroundColor} rounded-full p-0.5`}>
          {iconRender(type)}
        </div>
        <p className="text whitespace-pre-line flex-1">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
