import React from 'react'
import { ROUTES } from '@/helpers/routes';
import { HeaderNavBarProps } from '@/types/components/layout/Header.types';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { selectUserRole } from '@/redux/slices/user/userSelectors';

const activeClassLight =
  'font-semibold text-[var(--color-primary)]';
const inactiveClassLight = 'text-[var(--color-white)]';
const activeClassDark = 'font-semibold text-[var(--color-primary)]';
const inactiveClassDark = 'text-[var(--color-text-primary)]';

const HeaderNavBar: React.FC<HeaderNavBarProps> = ({ pathname, isLight, className }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const isHomeActive = pathname === '/' || pathname === ROUTES.HOME;
  const isCoursesActive = pathname === ROUTES.COURSES || pathname.startsWith('/courses/');
  const isMyLearningActive = pathname === ROUTES.MY_LEARNING;

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => {
    if (!isActive) return;
    event.preventDefault();
  };

  const activeClass = isLight ? activeClassLight : activeClassDark;
  const inactiveClass = isLight ? inactiveClassLight : inactiveClassDark;
  const getClass = (active: boolean) =>
    `transition-colors ${isLight ? 'hover:text-[var(--color-primary)]' : 'hover:text-[var(--color-primary)]'} ${active ? activeClass : inactiveClass}`;
  return (
    <nav aria-label="Main navigation" className={`flex flex-wrap items-center gap-8 ${className}`}>
      <NavLink
        to={ROUTES.HOME}
        end
        className={getClass(isHomeActive)}
        onClick={(event) => handleNavClick(event, isHomeActive)}
      >
        Home
      </NavLink>
      <NavLink
        to={ROUTES.COURSES}
        className={getClass(isCoursesActive)}
        onClick={(event) => handleNavClick(event, isCoursesActive)}
      >
        Courses
      </NavLink>
      {isAuthenticated && role === 'student' && (
        <NavLink
          to={ROUTES.MY_LEARNING}
          className={getClass(isMyLearningActive)}
          onClick={(event) => handleNavClick(event, isMyLearningActive)}
        >
          My learning
        </NavLink>
      )}
    </nav>
  );
}

export default HeaderNavBar;