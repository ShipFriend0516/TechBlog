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

  return (
    <div className={'fixed z-50 flex flex-col gap-2 top-10 right-10'}>
      {toasts.map((toast: Toast) => {
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
