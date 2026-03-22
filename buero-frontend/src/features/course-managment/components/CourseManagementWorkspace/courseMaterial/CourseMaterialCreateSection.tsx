import React from 'react';
import type { CourseMaterialCreateSectionProps } from '@/types/features/courseManagment/CourseMaterialCreateSection.types';

const CourseMaterialCreateSection: React.FC<CourseMaterialCreateSectionProps> = ({ children }) => (
  <section className="min-w-0 max-w-full overflow-x-hidden rounded-2xl bg-[var(--color-surface-background)] p-6">
    {children}
  </section>
);

export default CourseMaterialCreateSection;
