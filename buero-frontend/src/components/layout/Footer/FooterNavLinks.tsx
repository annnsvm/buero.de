import React from 'react';
import { Link } from 'react-router-dom';

type NavLink = { to: string; label: string };

const linkClass =
  'text-[0.9375rem] text-[var(--color-neutral-light)] transition-colors hover:text-[var(--color-neutral-white)]';

const FooterNavLinks: React.FC<{ links: readonly NavLink[] }> = ({ links }) => (
  <ul className="flex flex-col gap-3">
    {links.map(({ to, label }) => (
      <li key={label}>
        <Link to={to} className={linkClass}>
          {label}
        </Link>
      </li>
    ))}
  </ul>
);

export default FooterNavLinks;
