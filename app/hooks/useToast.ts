import { useCallback, useEffect, useMemo, useRef } from 'react';
import useToastStore from '@/app/stores/useToastStore';

const DEFAULT_DURATION = 5000;

interface ToastOptions {
  title?: string;
  duration?: number;
}

const useToast = () => {
  // 액션만 선택 구독 — toasts 배열 변경 시 사용처가 리렌더링되지 않도록 한다
  const createToast = useToastStore((state) => state.createToast);
  const removeToast = useToastStore((state) => state.removeToast);
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

  return useMemo(() => ({ success, error, info }), [success, error, info]);
};

export default useToast;
