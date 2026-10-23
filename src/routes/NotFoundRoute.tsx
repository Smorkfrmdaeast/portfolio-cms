import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundRoute: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center animate-fadeIn">
      <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
        404
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-base text-[#6B6F78] dark:text-[#8E93A0] max-w-md mx-auto mb-8 font-sans leading-relaxed">
        The page you are looking for does not exist or has been relocated in the portfolio index.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};
