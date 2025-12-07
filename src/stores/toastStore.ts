import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

const DEFAULT_DURATION = 3000; // 3 seconds

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message: string, type: ToastType = 'info', duration: number = DEFAULT_DURATION) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const toast: Toast = {
      id,
      type,
      message,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  hideToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for convenience
export const showSuccessToast = (message: string, duration?: number) => {
  useToastStore.getState().showToast(message, 'success', duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  useToastStore.getState().showToast(message, 'error', duration ?? 5000); // Errors show longer
};

export const showInfoToast = (message: string, duration?: number) => {
  useToastStore.getState().showToast(message, 'info', duration);
};

export const showWarningToast = (message: string, duration?: number) => {
  useToastStore.getState().showToast(message, 'warning', duration);
};

