import React from 'react';
import type { CourseStructureAsideEmptyStateProps } from '@/types/features/courseManagment/CourseStructureAside.types';

const CourseStructureAsideEmptyState: React.FC<CourseStructureAsideEmptyStateProps> = ({
  hasCourse,
}) => (
  <div className="mt-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-section)] p-4">
    <p className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
      {hasCourse ? 'No modules yet' : 'Nothing here yet'}
    </p>
    <p className="text-xs text-[var(--color-text-secondary)]">
      {hasCourse
        ? 'Create your first module to start building the course structure.'
        : 'Create your course first, then add modules and lessons.'}
    </p>
  </div>
);

export default CourseStructureAsideEmptyState;
