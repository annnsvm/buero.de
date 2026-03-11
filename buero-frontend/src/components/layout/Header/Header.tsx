import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES, isHeaderLightByPath } from '../../../helpers/routes';
import { Logo } from '@/components/ui';
import Container from '../Container/Container';
import HeaderNavBar from '@/components/layout/Header/HeaderNavBar';
import HeaderAuthTrialBar from '@/components/layout/Header/HeaderAuthTrialBar';
import HeaderMobileMenu from './HeaderMobileMenu';

const Header = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLight = isHeaderLightByPath(pathname);

  return (
    <header
      className={`absolute top-0 right-0 left-0 z-50 transition-colors duration-200 ${
        isLight ? 'bg-transparent' : 'bg-[var(--color-surface-section)]'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between gap-6 px-8 py-12 text-lg lg:px-16">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="buero.de go to home"
          >
            <Logo width={70} height={28} />
          </Link>
          <HeaderNavBar
            pathname={pathname}
            isLight={isLight}
            className="hidden lg:flex"
          />
          <HeaderAuthTrialBar isLight={isLight} className="hidden lg:flex" />
          <HeaderMobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLight={isLight}
            pathname={pathname}
            className="flex lg:hidden"
          />
        </div>
      </Container>
    </header>
  );
};

export default Header;
