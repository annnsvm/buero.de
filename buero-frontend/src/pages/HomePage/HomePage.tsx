
import { CallToAction, Hero, Proposition, WhyBuro } from '@/features/landing';
import Review from '@/features/landing/Review';
import { TrackYourProgress } from '@/features/landing/TrackYourProgress';

import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div aria-label="Home Page">
      <Hero />
      <WhyBuro />
      <Proposition />
      <TrackYourProgress />
      <Review/>
      <CallToAction />
    </div>
  );
};

export default HomePage;
