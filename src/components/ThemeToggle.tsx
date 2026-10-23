import React from 'react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 glass px-4 py-2 z-40 cursor-pointer hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <i className={`fas ${theme === 'dark' ? 'fa-moon text-blue-400' : 'fa-sun text-amber-500'}`} />
    </button>
  );
};
