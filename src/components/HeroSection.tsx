import React from 'react';
import { SearchBar } from './SearchBar';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section-bg relative flex items-center justify-center min-h-[100vh]">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        <div className="text-left w-full">
          <h1 className="text-white text-4xl md:text-6xl font-semibold">Explore</h1>
          <h1 className="text-blue-600 text-4xl md:text-6xl font-semibold mt-2">
            2nd District of Ilocos Sur
          </h1>
          <p className="text-white text-base md:text-lg mt-4">“Explore, Taste, and Enjoy the culture of every town.”</p>
        </div>
        <div className="mt-8 md:mt-10 w-full flex justify-center">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
