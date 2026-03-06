import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url(/images/home/hero.webp)] bg-cover bg-center bg-no-repeat"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/70" />
    </>
  );
};

export default HeroBackground;
