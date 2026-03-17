
import { CallToAction, Hero, Proposition, WhyBuro } from '@/features/landing';
import { TrackYourProgress } from '@/features/landing/TrackYourProgress';
// import { CheckoutButton, PortalButton } from '@/features/subscriptions';

import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div aria-label="Home Page">
      <Hero />
      <WhyBuro />
      <Proposition />
      <TrackYourProgress />
      <CallToAction />
      {/* <CheckoutButton courseId="f65717d8-2b75-4e93-87f0-a810b1cf2ddc" />
      <PortalButton /> */}
    </div>
  );
};

export default HomePage;
