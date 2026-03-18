import React from 'react';
import { FormField, Input } from '@/components/ui';
import { SectionTitle } from '@/components/layout';

type Props = {
  courseName: string;
  courseDescription: string;
  nameError?: string;
  descriptionError?: string;
  disabled?: boolean;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
};

const CourseDetailsSection: React.FC<Props> = ({
  courseName,
  courseDescription,
  nameError,
  descriptionError,
  disabled,
  onChangeName,
  onChangeDescription,
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
      </div>
    </section>
  );
};

export default CourseDetailsSection;

