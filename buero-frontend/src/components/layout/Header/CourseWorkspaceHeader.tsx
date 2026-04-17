import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { HeaderMobileMenuProps } from '@/types/components/layout/Header.types';

import HeaderAuthBar from './HeaderAuthBar';
import HeaderMobileMenu from './HeaderMobileMenu';
import Container from '../Container';

export type CourseWorkspaceHeaderProps = {
  isLight?: boolean;
  desktopStart: React.ReactNode;
  renderMobileNav: NonNullable<HeaderMobileMenuProps['renderNav']>;
  onOpenCourseStructure: () => void;
};

const courseStructureBtnClassName =
  'inline-flex shrink-0 items-center px-0 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-primary)] lg:hidden';

const CourseWorkspaceHeader: React.FC<CourseWorkspaceHeaderProps> = ({
  isLight = false,
  desktopStart,
  renderMobileNav,
  onOpenCourseStructure,
}) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 w-full shrink-0 border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={onOpenCourseStructure}
            className={courseStructureBtnClassName}
            aria-label="Open course structure"
          >
            <span className="max-w-[9.5rem] truncate sm:max-w-none">Course Structure</span>
          </button>
          <HeaderMobileMenu
            isOpen={menuOpen}
            setIsOpen={setMenuOpen}
            isLight={isLight}
            pathname={pathname}
            className="flex shrink-0"
            renderNav={renderMobileNav}
            courseWorkspaceOverlay
          />
        </div>


        <div className="hidden items-center justify-between gap-4 px-4 py-4 lg:flex lg:px-10">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
            {desktopStart}
            <button
              type="button"
              onClick={onOpenCourseStructure}
              className={courseStructureBtnClassName}
              aria-label="Open course structure"
            >
              Course Structure
            </button>
          </div>
          <HeaderAuthBar isLight={isLight} from="courseWorkspace" className="shrink-0" />
        </div>
    </div>
  );
};

export default CourseWorkspaceHeader;
