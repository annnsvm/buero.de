import { Link, useLocation } from 'react-router-dom';
import { ROUTES, isHeaderLightByPath } from '../../../helpers/routes';
import Container from '../Container/Container';
import HeaderNavBar from '@/components/ui/HeadersComponents/HeaderNavBar/HeaderNavBar';
import HeaderAuthTrialBar from '@/components/ui/HeadersComponents/HeaderAuthTrialBar/HeaderAuthTrialBar';
import { Logo } from '@/components/ui';
import HeaderMobileMenu from '@/components/ui/HeadersComponents/HeaderMobileMenu/HeaderMobileMenu';
import { useState } from 'react';

const Header = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLight = isHeaderLightByPath(pathname);

  return (
    <header
      className={`absolute z-50 top-0 right-0 left-0 transition-colors duration-200 ${isLight ? 'bg-transparent' : 'bg-[var(--color-surface-section)]'
        }`}
    >
      <Container>
        <div className="px-8 md:px-16 flex items-center justify-between gap-6 py-12 text-lg">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="buero.de go to home"
          >
            <Logo width={70} height={28} />
          </Link>
          <HeaderNavBar pathname={pathname} isLight={isLight} className="hidden min-[1024px]:flex" />
          <HeaderAuthTrialBar isLight={isLight} className="hidden min-[1024px]:flex" />
          <HeaderMobileMenu isOpen={isOpen} setIsOpen={setIsOpen} isLight={isLight} pathname={pathname} className="flex min-[1024px]:hidden"/>
        </div>
      </Container>
    </header>
  );
};

export default Header;
