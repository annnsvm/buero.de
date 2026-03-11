import { HeroTitleProps } from '@/types/features/home/Hero.types';
import React from 'react';

const HeroTitle: React.FC<HeroTitleProps> = ({ children }) => {
  return (
    <h1
      className="flex flex-col gap-3 font-[family-name:var(--font-heading)] text-[2rem] leading-[1.1] font-semibold tracking-[-0.84px] text-white sm:text-[3rem] lg:text-[5.25rem]"
      aria-label="Hero Title"
    >
      {children}
    </h1>
  );
};

export default HeroTitle;
