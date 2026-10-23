import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  caption,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus
    const previousActive = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';

      // Restore focus to trigger element or previous active
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previousActive) {
        previousActive.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image preview'}
      className="fixed inset-0 z-50 bg-[#0F1115]/95 flex items-center justify-center p-4 backdrop-blur-none animate-fadeIn"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-[3px] border border-[#22262F] bg-[#15181F] text-[#ECE8DF] hover:text-[#D9532B] hover:border-[#D9532B] transition-colors focus:ring-2 focus:ring-[#D9532B]"
        aria-label="Close image lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[75vh] max-w-full object-contain rounded-[2px] border border-[#22262F] shadow-2xl"
        />
        {(caption || alt) && (
          <p className="mt-3 text-xs font-mono text-[#8E93A0] text-center max-w-lg">
            {caption || alt}
          </p>
        )}
      </div>
    </div>
  );
};
