import useToastStore from '@/app/stores/useToastStore';
import { useCallback, useEffect, useRef } from 'react';

const useToast = () => {
  const { createToast, removeToast } = useToastStore();
  const DURATION = 5000;
  const timerIDs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toast = useCallback(
    (message: string, type: 'success' | 'error') => {
      const newToast = {
        id: new Date().getTime() + Math.floor(Math.random() * 200),
        message,
        type,
        duration: DURATION || 5000,
      };

      createToast(newToast);
      const id = setTimeout(() => {
        removeToast(newToast.id);
        timerIDs.current = timerIDs.current.filter((timerId) => timerId !== id);
      }, DURATION);
    },
    [createToast, removeToast]
  );

  useEffect(() => {
    return () => {
      timerIDs.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const success = useCallback(
    (message: string) => {
      toast(message, 'success');
    },
    [toast]
  );

  const error = useCallback(
    (message: string) => {
      toast(message, 'error');
    },
    [toast]
  );

  return { success, error };
};

export default useToast;
