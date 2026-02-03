import React from 'react';

interface HeroSectionProps {
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  return (
    <section className="relative flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-blue-100">
      {children}
    </section>
  );
};
