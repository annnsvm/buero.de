import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';

const currentYear = new Date().getFullYear();

const linkClass =
  'text-[0.8125rem] text-[var(--color-neutral-light)] underline transition-colors hover:text-[var(--color-neutral-white)]';

const FooterBottomBar: React.FC = () => (
  <div className="border-t border-[var(--opacity-neutral-darkest-15)]">
    <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
      <p className="order-2 text-[0.8125rem] text-[var(--color-neutral-base)] sm:order-1">
        © {currentYear} Buro.de. All rights reserved.
      </p>
      <nav aria-label="Legal links" className="order-1 flex flex-wrap items-center justify-center gap-4 sm:order-2">
        <Link to="/privacy" className={linkClass}>
          Privacy Policy
        </Link>
        <Link to="/terms" className={linkClass}>
          Terms of Service
        </Link>
        <Link to="/cookies" className={linkClass}>
          Cookies Settings
        </Link>
      </nav>
    </Container>
  </div>
);

export default FooterBottomBar;
