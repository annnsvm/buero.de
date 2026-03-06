import { HeroSubtextProps } from '@/types/features/home/Hero.types';
import React from 'react';

const HeroSubtext: React.FC<HeroSubtextProps> = ({ children }) => {
  return (
    <p className="text-base leading-[1.5] font-semibold text-[0.8rem] sm:text-[1.1rem] md:text-[1.25rem]">
      {children}
    </p>
  );
};

export default HeroSubtext;
