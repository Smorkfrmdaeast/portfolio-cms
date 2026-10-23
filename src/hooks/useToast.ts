import { useState, useCallback, useRef } from 'react';
import { ToastMessage, ToastType } from '../types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timeout = timeoutRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (text: string, type: ToastType = 'info', action?: { label: string; onClick: () => void }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, text, type, action };

      setToasts((prev) => [...prev, newToast]);

      const timeout = setTimeout(() => {
        removeToast(id);
      }, action ? 6000 : 3500);

      timeoutRef.current.set(id, timeout);
      return id;
    },
    [removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
  };
}
