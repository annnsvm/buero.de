import React from 'react';

const CTA_BACKGROUND_IMAGE = '/images/home/offer_result.webp';

const CallToActionBackground: React.FC = () => (
  <>
    <img
      src={CTA_BACKGROUND_IMAGE}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover object-center"
      loading="lazy"
      decoding="async"
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-[var(--color-cod-gray-base)]/70"
    />
  </>
);

export default CallToActionBackground;
