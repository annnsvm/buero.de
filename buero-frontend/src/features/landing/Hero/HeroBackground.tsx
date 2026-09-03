import React from 'react';

const HERO_SRC = '/images/home/hero.webp';
const HERO_SRC_MOBILE = '/images/home/hero-800.webp';

const HeroBackground: React.FC = () => {
  return (
    <>
      <img
        src={HERO_SRC}
        srcSet={`${HERO_SRC_MOBILE} 800w, ${HERO_SRC} 1600w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        className="buero-hero-bg absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />
      <div aria-hidden="true" className="buero-hero-overlay absolute inset-0 bg-black/70" />
    </>
  );
};

export default HeroBackground;
