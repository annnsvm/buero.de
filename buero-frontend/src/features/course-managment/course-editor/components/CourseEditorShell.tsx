import React, { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import type { CourseEditorShellProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorShell: React.FC<CourseEditorShellProps> = ({ aside, children }) => (
  <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
    {aside}
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="fixed top-0 z-10 flex w-full justify-center border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)] px-4 py-8 lg:justify-start lg:px-10">
        <NavLink
          to={ROUTES.COURSES}
          className="text-[1.25rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
        >
          All courses
        </NavLink>
      </div>
      {children}
    </div>
  </div>
);

export default CourseEditorShell;
