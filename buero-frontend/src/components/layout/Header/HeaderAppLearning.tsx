import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, isHeaderLightByPath } from '@/helpers/routes';
import { Logo } from '@/components/ui';
import Container from '../Container/Container';
import HeaderLearningNav from './HeaderLearningNav';
import HeaderLearningMobileMenu from './HeaderLearningMobileMenu';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';

const HeaderAppLearning: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLight = isHeaderLightByPath(pathname);
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <header className="bg-[var(--color-neutral-white)] md:h-[76px] w-full max-w-[90rem] mx-auto">
      <Container className="flex h-full items-center justify-between max-w-[90rem]">
        <div className="w-full md:w-[360px]">
          <Link
            to={ROUTES.HOME}
            className="flex h-[76px] w-full max-w-[360px] items-center gap-2 px-6 py-4 border-r border-r-[var(--opacity-neutral-darkest-15)] transition-opacity hover:opacity-80"
            aria-label="buero.de go to home"
          >
            <Logo width={70} height={28} />
          </Link>
        </div>
        <div
          className="flex h-full items-center justify-between w-full max-w-[1080px] px-6"
          style={{
            height: '100%',
            // Persist browser-preview border behavior: only bottom border visible.
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderTopWidth: '0px',
            borderTopStyle: 'none',
            borderTopColor: 'rgba(0, 0, 0, 0)',
            borderRightWidth: '0px',
            borderRightStyle: 'none',
            borderRightColor: 'rgba(0, 0, 0, 0)',
            borderLeftWidth: '0px',
            borderLeftStyle: 'none',
            borderLeftColor: 'rgba(0, 0, 0, 0)',
            borderBottomColor: 'var(--opacity-neutral-darkest-15)',
            // Match preview: element text color.
            color: 'var(--opacity-neutral-darkest-15)',
          }}
        >
          <div className="flex h-full w-fit items-center justify-between gap-0">
            <HeaderLearningNav />

          </div>

          <HeaderLearningMobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLight={isLight}
            pathname={pathname}
            className="flex lg:hidden"
          />

          <div className="hidden lg:flex h-full w-fit items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <span className="text-[18px] leading-[150%] font-normal text-[var(--color-text-primary)]">
                Admin Teacher
              </span>
              <svg
                className="h-6 w-6 text-[var(--color-text-primary)]"
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
      </Container>
    </header>
  );
};

export default HeaderAppLearning;

