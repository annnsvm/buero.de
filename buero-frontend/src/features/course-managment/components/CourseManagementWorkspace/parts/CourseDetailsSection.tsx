import React from 'react';
import { FormField, Input, Select } from '@/components/ui';
import { SectionTitle } from '@/components/layout';
import { COURSE_LEVEL_OPTIONS } from '@/features/course-managment/helpers/courseCreation.consts';
import type { CourseDetailsSectionProps } from '@/types/features/courseManagment/CourseDetailsSection.types';

const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({
  courseName,
  courseDescription,
  level,
  nameError,
  descriptionError,
  levelError,
  disabled,
  onChangeName,
  onChangeDescription,
  onChangeLevel,
}) => {
  return (
    <section aria-label="Course card">
      <SectionTitle label="course card" className="pb-4 text-[var(--color-accent-primary)]">
        COURSE CARD
      </SectionTitle>
      <div className="flex flex-col gap-4">
        <FormField
          label="Course name"
          name="courseName"
          error={nameError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <Input
            id="courseName"
            placeholder="Put a name of the course, it should appear above"
            value={courseName}
            onChange={(e) => onChangeName(e.target.value)}
            disabled={disabled}
          />
        </FormField>
        <FormField
          label="Course description"
          name="courseDescription"
          error={descriptionError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <textarea
            id="courseDescription"
            placeholder="Put a description of the course, it should appear above"
            value={courseDescription}
            onChange={(e) => onChangeDescription(e.target.value)}
            rows={3}
            disabled={disabled}
            className="w-full rounded-[12px] border border-[var(--color-border-default)] px-4 py-2 outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </FormField>
        <FormField
          label="Course level"
          name="courseLevel"
          error={levelError}
          className="space-y-4 rounded-2xl bg-[var(--color-surface-background)] p-6"
        >
          <Select
            ariaLabel="Course level"
            value={level}
            options={COURSE_LEVEL_OPTIONS}
            onChange={(nextValue) => onChangeLevel(nextValue)}
            placeholderValue=""
            disabled={disabled}
            triggerClassName="w-full"
          />
        </FormField>
      </div>
    </section>
  );
};

export default CourseDetailsSection;

