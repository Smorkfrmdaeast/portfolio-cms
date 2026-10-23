import React, { useEffect } from 'react';

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
}

export const HeroModal: React.FC<HeroModalProps> = ({
  isOpen,
  onClose,
  imageSrc = '/assets/hero.jpg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="heroModal"
      className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-3xl cursor-pointer text-white/80 hover:text-white transition p-2 focus:outline-none"
        aria-label="Close modal"
      >
        ✖
      </button>
      <div
        className="relative max-w-2xl max-h-[90vh] flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          id="heroFull"
          src={imageSrc}
          alt="Ifeanyi Nnamani Full View"
          className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl border border-white/20 object-contain"
        />
      </div>
    </div>
  );
};
