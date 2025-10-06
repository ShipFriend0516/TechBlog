import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  removeToast: () => void;
}

const Toast = ({ message, type, removeToast }: ToastProps) => {
  const iconRender = (type: 'success' | 'error') => {
    if (type === 'success') {
      return <CiCircleCheck color={'green'} size={40} />;
    } else {
      return <CiCircleRemove color={'red'} size={40} />;
    }
  };
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div
        onClick={() => removeToast()}
        className={`
          transform transition-all duration-300 ease-out animate-slideUp
          bg-gray-200/90 text-black px-4 py-3 rounded-lg flex items-center gap-3 
          backdrop-blur-sm w-full max-w-md origin-center cursor-pointer 
          hover:bg-gray-300/90 hover:shadow-lg
        `}
      >
        <div className={`flex items-center justify-center rounded-full p-0.5`}>
          {iconRender(type)}
        </div>
        <p className="text line-clamp-1 whitespace-pre-line flex-1">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Toast;
