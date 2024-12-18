import { IoIosClose } from 'react-icons/io';
import ProgressBar from '@/app/entities/common/Loading/ProgressBar';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  removeToast: () => void;
}

const Toast = ({ message, type, removeToast }: ToastProps) => {
  return (
    <div
      className={`relative flex items-center text-medium-s ${type === 'error' ? 'bg-red-400' : 'bg-green-100'} overflow-hidden text-white w-80 h-16 shadow-xl  p-2 z-50 revealExpand`}
      aria-label={`${type}타입의 토스트 메시지, 5초 후에 사라집니다.`}
    >
      <div className={'flex'}>
        <p
          className={'flex-grow break-keep whitespace-pre-wrap hyphens-none'}
          aria-label={'토스트 메시지 내용'}
        >
          {message}
        </p>
        <button
          onClick={removeToast}
          className={'text-2xl absolute right-1 top-1'}
          aria-label={'토스트 메시지 닫기 버튼'}
        >
          <IoIosClose />
        </button>
      </div>
      <ProgressBar duration={5000} />
    </div>
  );
};

export default Toast;
