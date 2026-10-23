import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#FFFFFF] dark:bg-[#15181F] text-[#16181D] dark:text-[#ECE8DF] border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] shadow-lg text-sm transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#D9532B] shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[#6B6F78] dark:text-[#8E93A0] shrink-0" />}
              <span className="truncate">{toast.text}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="text-xs font-mono font-medium text-[#D9532B] hover:underline cursor-pointer px-1.5 py-0.5 rounded-[2px]"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#6B6F78] hover:text-[#16181D] dark:hover:text-[#ECE8DF] p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
