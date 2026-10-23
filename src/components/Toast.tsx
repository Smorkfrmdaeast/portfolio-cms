import React from 'react';

interface ToastProps {
  message: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, show }) => {
  return (
    <div id="toast" className={`toast ${show ? 'show' : ''}`}>
      <span className="flex items-center gap-2">
        <i className="fas fa-check-circle text-sm" />
        {message}
      </span>
    </div>
  );
};
