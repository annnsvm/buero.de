
import { Hero, WhyBuro } from '@/features/landing';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div aria-label="Home Page">
      <Hero />
      <WhyBuro />
    </div>
  );
};

export default HomePage;
