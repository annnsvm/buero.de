import React, { useCallback, useEffect, useState } from 'react';
import { HeaderMobileMenuProps } from '@/types/components/layout/Header.types';
import { Button } from '@/components/ui';
import HeaderNavBar from './HeaderNavBar';
import HeaderAuthTrialBar from './HeaderAuthTrialBar';


const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  setIsOpen,
  isOpen,
  isLight,
  pathname,
  className,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const hambuergerLine = `w-full h-0.5 transition-all duration-300 ease-in-out ${isLight ? 'bg-[var(--color-surface-card)]' : 'bg-[var(--color-text-primary)]'}`;
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

  const overlayClasses = [
    'fixed inset-0 z-50 bg-[var(--opacity-neutral-darkest-60)] backdrop-blur-sm',
    'transition-opacity duration-300',
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
  ].join(' ');

  const panelClasses = [
    'mx-auto flex h-full w-full max-w-[480px] flex-col px-6 py-8 text-lg',
    'transition-transform duration-300',
    isOpen ? 'translate-y-0' : 'translate-y-4',
  ].join(' ');

  return (
    <>
      <div className={`${className}`}>
        <Button
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
          styleType="mobile"
          className={`px-2 py-2 ${isOpen ? 'z-500' : ''}`}
        >
          <span
            className={`relative flex h-4 w-5 flex-col justify-between ${isAnimated ? 'open' : ''}`}
          >
            <span
              className={`${hambuergerLine} ${isOpen ? 'translate-x-[6px] translate-y-[7px] rotate-45' : ''}`}
            ></span>
            <span className={`${hambuergerLine} ${isOpen ? 'scale-x-0 opacity-0' : ''}`}></span>
            <span
              className={`${hambuergerLine} ${isOpen ? 'translate-x-[7px] -translate-y-[6px] -rotate-45' : ''}`}
            ></span>
          </span>
        </Button>
      </div>
      <div className={overlayClasses} onClick={closeMenu}>
        <div className={panelClasses} onClick={(event) => event.stopPropagation()}>
          <div className="flex flex-1 items-center justify-center">
            <HeaderNavBar
              pathname={pathname}
              isLight={isLight}
              className="fs-18 flex flex-col items-center gap-6 lg:hidden"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:hidden">
            <HeaderAuthTrialBar
              isLight={isLight}
              className="mx-auto flex w-full max-w-[280px] flex-col gap-4"
              from="mobile"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMobileMenu;
