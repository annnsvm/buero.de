import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderMobileMenuProps } from '@/types/components/layout/Header.types';
import { Button } from '@/components/ui';
import HeaderNavBar from './HeaderNavBar';
import HeaderAuthBar from './HeaderAuthBar';
import LanguageSwitcher from './LanguageSwitcher';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  setIsOpen,
  isOpen,
  isLight,
  pathname,
  className,
  renderNav,
  courseWorkspaceOverlay = false,
}) => {
  const { t } = useTranslation();
  const [isAnimated, setIsAnimated] = useState(false);
  const hambuergerLine = `w-full h-0.5 transition-all duration-300 ease-in-out ${isLight ? 'bg-[var(--color-surface-card)]' : 'bg-[var(--color-text-primary)]'}`;
  const user = useAppSelector(selectCurrentUser);
  const toggleMenu = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(!isOpen);
    }
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setIsAnimated(true);
      }, 10);
    } else {
      setIsAnimated(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  const closeMenu = useCallback(() => {
    setIsAnimated(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, [setIsOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
      return;
    }

    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      return;
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const overlayTone = !isLight
    ? 'bg-black/80 backdrop-blur-md'
    : 'bg-[var(--opacity-neutral-darkest-60)] backdrop-blur-sm';

  const overlayClasses = [
    'fixed inset-0 z-50 transition-opacity duration-300',
    overlayTone,
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
  ].join(' ');

  const panelClasses = [
    'mx-auto flex h-full w-full max-w-[480px] flex-col px-6 py-8 text-lg',
    isLight ? 'text-white' : '',
    'transition-transform duration-300',
    isOpen ? 'translate-y-0' : 'translate-y-4',
  ]
    .filter(Boolean)
    .join(' ');

  const navShellClassName = !isLight
    ? 'fs-18 flex flex-col items-center gap-6 text-center text-white lg:hidden'
    : 'fs-18 flex flex-col items-center gap-6 lg:hidden';

  const authBarLight = courseWorkspaceOverlay ? true : isLight;
  const renderNavLight = courseWorkspaceOverlay ? true : isLight;

  return (
    <>
      <div className={`${className}`}>
        <Button
          aria-label={t('header.toggleMenu')}
          aria-expanded={isOpen}
          onClick={toggleMenu}
          styleType="mobile"
          className={`px-2 py-2 ${isOpen ? 'z-500' : ''}`}
        >
          <span
            className={`relative flex h-4 w-5 flex-col justify-between ${isAnimated ? 'open' : ''}`}
          >
            <span
              className={`${hambuergerLine} ${isOpen ? 'translate-x-[6px] translate-y-[7px] rotate-45' : ''} ${!isLight && isOpen && 'bg-white'}`}
            ></span>
            <span className={`${hambuergerLine} ${isOpen ? 'scale-x-0 opacity-0' : ''}`}></span>
            <span
              className={`${hambuergerLine} ${isOpen ? 'translate-x-[7px] -translate-y-[6px] -rotate-45' : ''} ${!isLight && isOpen && 'bg-white'}`}
            ></span>
          </span>
        </Button>
      </div>
      <div className={overlayClasses} onClick={closeMenu}>
        <div className={panelClasses} onClick={(event) => event.stopPropagation()}>
          {user && (
            <div className="mt-4 flex w-full flex-col items-start gap-4 lg:hidden">
              <LanguageSwitcher isLight className="ml-1" />
              <HeaderAuthBar isLight={true} from="mobile" className="mr-auto" />
            </div>
          )}
          <div className="flex flex-1 items-center justify-center">
            {renderNav ? (
              renderNav({
                pathname,
                isLight: renderNavLight,
                className: navShellClassName,
              })
            ) : (
              <HeaderNavBar pathname={pathname} isLight={true} className={navShellClassName} />
            )}
          </div>

          {!user && (
            <div className="mt-6 flex flex-col gap-4 lg:hidden">
              <LanguageSwitcher isLight={authBarLight} className="mx-auto" />
              <HeaderAuthBar
                isLight={authBarLight}
                className="mx-auto flex w-full max-w-[280px] flex-col gap-4"
                from="mobile"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderMobileMenu;
