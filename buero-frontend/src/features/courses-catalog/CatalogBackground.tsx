import React from 'react';

const CATALOG_SRC = '/images/courses/choose.webp';
const CATALOG_SRC_MOBILE = '/images/courses/choose-800.webp';

const CatalogBackground: React.FC = () => {
  return (
    <>
      <img
        src={CATALOG_SRC}
        srcSet={`${CATALOG_SRC_MOBILE} 800w, ${CATALOG_SRC} 1920w`}
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

export default CatalogBackground;
