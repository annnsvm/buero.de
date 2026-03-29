import React, { useCallback, useEffect, useState } from 'react';
import HeaderAuthBar from './HeaderAuthBar';
import HeaderLearningNav from './HeaderLearningNav';
import type { HeaderMobileMenuProps } from '@/types/components/layout/Header.types';
import { Button } from '@/components/ui';

const HeaderLearningMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  isOpen,
  setIsOpen,
  isLight,
  pathname,
  className = '',
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const hambuergerLine = `w-full h-0.5 transition-all duration-300 ease-in-out ${
    isOpen
      ? 'bg-[var(--color-neutral-white)]'
      : isLight
        ? 'bg-[var(--color-surface-card)]'
        : 'bg-[var(--color-text-primary)]'
  }`;

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
  }, [pathname, setIsOpen]);

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
    if (isOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) closeMenu();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
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
      <div className={className}>
        <Button
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
          styleType="mobile"
          className={`px-2 py-2 ${isOpen ? 'z-500' : ''}`}
        >
          <span
            className={`relative flex h-4 w-5 flex-col justify-between ${
              isAnimated ? 'open' : ''
            }`}
          >
            <span
              className={`${hambuergerLine} ${
                isOpen ? 'translate-x-[6px] translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span className={`${hambuergerLine} ${isOpen ? 'scale-x-0 opacity-0' : ''}`} />
            <span
              className={`${hambuergerLine} ${
                isOpen ? 'translate-x-[7px] -translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </span>
        </Button>
      </div>

      <div className={overlayClasses} onClick={closeMenu}>
        <div className={panelClasses} onClick={(event) => event.stopPropagation()}>
            <div className="mt-0 flex justify-start items-center gap-4" style={{ height: 'fit-content' }}>
              <div
                className="flex h-full w-full items-center justify-start gap-4"
                style={{ width: '100%' }}
              >
              <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--color-neutral-white)]" />
                <div className="flex items-center gap-1">
                <span className="text-[18px] leading-[150%] font-normal text-[var(--color-neutral-white)]">
                  Admin Teacher
                </span>
                <svg
                  className="flex h-6 w-6 text-[var(--color-neutral-white)]"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-start">
            <HeaderLearningNav
              className="flex flex-col items-center gap-6 max-w-[280px] text-[var(--color-neutral-white)]"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 items-center">
            <HeaderAuthBar
              isLight={true}
              className="mx-auto flex w-full max-w-[280px] flex-col gap-4"
              from="mobile"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderLearningMobileMenu;

