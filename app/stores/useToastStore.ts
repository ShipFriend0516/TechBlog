import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  createToast: (toast: Toast) => void;
  removeToast: (id: number) => void;
}

const useToastStore = create<ToastState>((set) => ({
  // 상태
  toasts: [] as Toast[],
  // 액션
  createToast: (toast: Toast) =>
    set((state) => ({ toasts: [toast, ...state.toasts] })),
  removeToast: (id: number) =>
    set((state) => ({
      toasts: state.toasts.filter((toast: Toast) => toast.id !== id),
    })),
}));

export default useToastStore;
