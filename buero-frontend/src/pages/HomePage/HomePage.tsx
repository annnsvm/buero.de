
import { CallToAction, Hero, Proposition, WhyBuro } from '@/features/landing';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div aria-label="Home Page">
      <Hero />
      <WhyBuro />
      <Proposition />
      <CallToAction />
    </div>
  );
};

export default HomePage;
