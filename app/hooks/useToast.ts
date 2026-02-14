import { useCallback, useEffect, useRef } from 'react';
import useToastStore from '@/app/stores/useToastStore';

const DEFAULT_DURATION = 5000;

interface ToastOptions {
  title?: string;
  duration?: number;
}

const useToast = () => {
  const { createToast, removeToast } = useToastStore();
  const timerIDs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toast = useCallback(
    (message: string, type: 'success' | 'error' | 'info', options?: ToastOptions) => {
      const duration = options?.duration ?? DEFAULT_DURATION;
      const newToast = {
        id: new Date().getTime() + Math.floor(Math.random() * 200),
        message,
        title: options?.title,
        type,
        duration,
      };

      createToast(newToast);
      const id = setTimeout(() => {
        removeToast(newToast.id);
        timerIDs.current = timerIDs.current.filter((timerId) => timerId !== id);
      }, duration);
    },
    [createToast, removeToast]
  );

  useEffect(() => {
    return () => {
      timerIDs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      toast(message, 'success', options);
    },
    [toast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      toast(message, 'error', options);
    },
    [toast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      toast(message, 'info', options);
    },
    [toast]
  );

  return { success, error, info };
};

export default useToast;
