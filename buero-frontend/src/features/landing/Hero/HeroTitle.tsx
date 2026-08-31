import { HeroTitleProps } from '@/types/features/home/Hero.types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroTitle: React.FC<HeroTitleProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const isUk = i18n.language.toLowerCase().startsWith('uk');

  const sizeClasses = isUk
    ? 'text-[clamp(1.75rem,4.5vw+0.5rem,4rem)] font-medium leading-[1.15] tracking-[-0.02em]'
    : 'text-[2rem] sm:text-[3rem] lg:text-[5.25rem] font-semibold leading-[1.1] tracking-[-0.84px]';

  const layoutClasses = isUk ? 'gap-2 text-center' : 'gap-3';

  return (
    <h1
      className={`flex flex-col font-[family-name:var(--font-heading)] text-white ${layoutClasses} ${sizeClasses}`}
      aria-label="Hero Title"
    >
      {children}
    </h1>
  );
};

export default HeroTitle;
