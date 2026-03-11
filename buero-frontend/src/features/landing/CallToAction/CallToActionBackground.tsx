import React from 'react';

const CTA_BACKGROUND_IMAGE = '/images/home/offer_result.webp';

const CallToActionBackground: React.FC = () => (
  <>
    <div
      aria-hidden
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${CTA_BACKGROUND_IMAGE})` }}
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-[var(--color-cod-gray-base)]/70"
    />
  </>
);

export default CallToActionBackground;
