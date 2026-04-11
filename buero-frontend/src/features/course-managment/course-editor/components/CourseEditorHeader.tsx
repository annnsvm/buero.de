import React from 'react';
import { Container, Text, Title } from '@/components/layout';
import type { CourseEditorHeaderProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorHeader: React.FC<CourseEditorHeaderProps> = ({
  watchedTitle,
  watchedDescription,
  activeRightTab,
  activeModuleTitle,
}) => (
  <header className="shrink-0 pt-40">
    <Container className="px-4 sm:px-6">
      <div className="flex w-full flex-col items-center gap-2 text-[var(--color-neutral-darkest)]">
        <Title className="text-center text-[2rem] sm:text-[3rem] lg:text-[3.75rem]">
          {watchedTitle.trim() ? watchedTitle.trim() : 'New course'}
        </Title>
        <Text
          className="text-center text-[0.9rem] sm:text-[0.9rem] lg:text-[1.25rem]"
          label="create course text"
        >
          {activeRightTab === 'material'
            ? `Module: ${activeModuleTitle}`
            : watchedDescription.trim()
              ? watchedDescription.trim()
              : 'Add a description to help students understand what they will learn.'}
        </Text>
      </div>
    </Container>
  </header>
);

export default CourseEditorHeader;
