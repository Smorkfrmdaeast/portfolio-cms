import React from 'react';

interface HeroProps {
  onOpenHeroModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenHeroModal }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
      <img
        id="heroImg"
        src="/assets/hero.jpg"
        alt="Ifeanyi Nnamani - Smork"
        className="w-36 h-36 rounded-full mb-4 border-2 border-blue-600 shadow-xl object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={onOpenHeroModal}
        title="Click to view full photo"
      />

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Ifeanyi Nnamani
      </h1>
      <p className="text-2xl text-blue-400 font-bold mt-2">
        Smork♿💫
      </p>
      <p className="text-lg mt-3 text-gray-400">
        Software Engineer / Frontend Developer
      </p>

      <div className="flex gap-4 mt-6">
        <a
          href="#projects"
          className="glass px-6 py-3 font-semibold text-sm tracking-wider uppercase transition hover:bg-blue-600/20"
        >
          VIEW WORK
        </a>
        <a
          href="#contact"
          className="glass px-6 py-3 font-semibold text-sm tracking-wider uppercase transition hover:bg-blue-600/20"
        >
          CONTACT
        </a>
      </div>
    </section>
  );
};
