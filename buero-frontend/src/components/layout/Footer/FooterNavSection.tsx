import React from 'react';

type FooterNavSectionProps = {
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
};

const FooterNavSection: React.FC<FooterNavSectionProps> = ({ title, ariaLabel, children }) => (
  <nav aria-label={ariaLabel} className="min-w-max">
    <h3 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-neutral-white)]">
      {title}
    </h3>
    {children}
  </nav>
);

export default FooterNavSection;
