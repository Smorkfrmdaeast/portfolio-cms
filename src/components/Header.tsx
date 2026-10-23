import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, isAdmin }) => {
  const location = useLocation();
  const isWork = location.pathname.startsWith('/work');
  const isHome = location.pathname === '/';

  return (
    <>
      {/* Skip to Content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#16181D] focus:text-[#F4F1EA] focus:text-sm focus:rounded-[3px] focus:ring-2 focus:ring-[#D9532B]"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-[#F4F1EA]/95 dark:bg-[#0F1115]/95 border-b border-[#D9D4C7] dark:border-[#22262F] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="text-lg font-serif tracking-tight font-medium text-[#16181D] dark:text-[#ECE8DF] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors whitespace-nowrap shrink-0"
          >
            Ifeanyi Nnamani
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8 text-sm font-sans text-[#2C3038] dark:text-[#8E93A0]" aria-label="Main Navigation">
            <Link
              to="/work"
              className={`hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                isWork ? 'border-[#D9532B] text-[#16181D] dark:text-[#ECE8DF] font-medium' : 'border-transparent'
              }`}
            >
              Work
            </Link>
            {isHome ? (
              <a
                href="#about"
                className="hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 border-transparent"
              >
                About
              </a>
            ) : (
              <Link
                to="/#about"
                className="hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 border-transparent"
              >
                About
              </Link>
            )}
            {isHome ? (
              <a
                href="#contact"
                className="hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 border-transparent"
              >
                Contact
              </a>
            ) : (
              <Link
                to="/#contact"
                className="hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 border-transparent"
              >
                Contact
              </Link>
            )}
            <Link
              to="/admin"
              className={`hover:text-[#D9532B] dark:hover:text-[#ECE8DF] transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                location.pathname.startsWith('/admin') ? 'border-[#D9532B] text-[#16181D] dark:text-[#ECE8DF] font-medium' : 'border-transparent text-xs uppercase tracking-wider font-mono opacity-80'
              }`}
            >
              {isAdmin ? 'Admin •' : 'Admin'}
            </Link>
          </nav>

          {/* Zone 3: Primary Action (Theme Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleTheme}
              className="p-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] bg-white dark:bg-[#15181F] text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] dark:hover:border-[#D9532B] hover:text-[#D9532B] transition-all cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light paper theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light paper' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#2C3038]" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
