import { ROUTES } from '@/helpers/routes';
import { HeaderNavBarProps } from '@/types/components/layout/Header.types';
import React from 'react'
import { NavLink } from 'react-router-dom';

const activeClassLight =
  'font-semibold text-[var(--color-primary-foreground)] underline underline-offset-4';
const inactiveClassLight = 'text-[var(--color-white)]';
const activeClassDark = 'font-semibold text-[var(--color-primary)] underline underline-offset-4';
const inactiveClassDark = 'text-[var(--color-text-primary)]';

const HeaderNavBar: React.FC<HeaderNavBarProps> = ({ pathname, isLight, className }) => {
  const isHomeActive = pathname === '/' || pathname === ROUTES.HOME;
  const isCoursesActive = pathname === ROUTES.COURSES || pathname.startsWith('/courses/');
  const isProfileActive = pathname === ROUTES.PROFILE;

  const activeClass = isLight ? activeClassLight : activeClassDark;
  const inactiveClass = isLight ? inactiveClassLight : inactiveClassDark;
  const getClass = (active: boolean) =>
    `transition-colors ${isLight ? 'hover:text-[var(--color-primary-foreground)]' : 'hover:text-[var(--color-primary)]'} ${active ? activeClass : inactiveClass}`;
  return (
    <nav aria-label="Main navigation" className={`tablet:gap-8 flex flex-wrap items-center ${className}`}>
      <NavLink to={ROUTES.HOME} end className={getClass(isHomeActive)}>
        Home
      </NavLink>
      <NavLink to={ROUTES.COURSES} className={getClass(isCoursesActive)}>
        Courses
      </NavLink>
      <NavLink to={ROUTES.PROFILE} className={getClass(isProfileActive)}>
        My Learning
      </NavLink>
    </nav>
  )
}

export default HeaderNavBar;