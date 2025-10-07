'use client';
import Toast from '@/app/entities/common/Toast/Toast';
import useToastStore from '@/app/stores/useToastStore';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastProvider = () => {
  const { toasts, removeToast } = useToastStore();

  const reversedToasts = toasts.toReversed();
  return (
    <div
      className={
        'fixed bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col gap-4  z-50 w-[90%] max-w-md'
      }
    >
      {reversedToasts.map((toast: Toast) => {
        return (
          <Toast
            key={toast.id}
            removeToast={() => removeToast(toast.id)}
            message={toast.message}
            type={toast.type}
          />
        );
      })}
    </div>
  );
};

export default ToastProvider;
