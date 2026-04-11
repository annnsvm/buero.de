import React from 'react';
import { Container, Section } from '@/components/layout';
import CourseCoverSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCoverSection';import CourseDetailsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDetailsSection';
import CourseTagsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseTagsSection';
import CoursePriceSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CoursePriceSection';
import CourseDurationSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDurationSection';
import CourseCreateActions from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCreateActions';
import type { CourseLevel } from '@/types/features/courseManagment/CourseLevel.types';
import type { CourseEditorCourseFormTabProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorCourseFormTab: React.FC<CourseEditorCourseFormTabProps> = ({
  mode,
  handleSubmit,
  handleFormSubmit,
  handleCreateCourseSubmit,
  runCourseUpdate,
  errors,
  isFormDisabled,
  canCreate,
  canUpdate,
  isCreatingCourse,
  isUpdatingCourse,
  createCourseError,
  coverPreviewUrl,
  setCoverFile,
  setCoverPreviewUrl,
  watchedTitle,
  watchedDescription,
  watchedLevel,
  watchedTags,
  watchedPrice,
  priceCurrencySymbol,
  setPriceCurrencySymbol,
  setValue,
  computedDurationMinutes,
  watchedVideoLessonsCount,
  coverFile,
}) => (
  <Section className="py-8">
    <Container className="max-w-[1100px] px-4 sm:px-6">
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <CourseCoverSection
          coverPreviewUrl={coverPreviewUrl}
          disabled={isFormDisabled}
          onPick={(file, previewUrl) => {
            setCoverFile(file);
            setCoverPreviewUrl(previewUrl);
          }}
          onClear={() => {
            setCoverFile(null);
            setCoverPreviewUrl(null);
          }}
        />

        <CourseDetailsSection
          courseName={watchedTitle}
          courseDescription={watchedDescription}
          level={watchedLevel as CourseLevel}
          nameError={errors.title?.message}
          descriptionError={errors.description?.message}
          levelError={errors.level?.message}
          disabled={isFormDisabled}
          onChangeName={(value) =>
            setValue('title', value, { shouldDirty: true, shouldValidate: true })
          }
          onChangeDescription={(value) =>
            setValue('description', value, { shouldDirty: true, shouldValidate: true })
          }
          onChangeLevel={(value: CourseLevel) =>
            setValue('level', value, { shouldDirty: true, shouldValidate: true })
          }
        />

        <CourseTagsSection
          tags={watchedTags}
          disabled={isFormDisabled}
          onChangeTags={(next) =>
            setValue('tags', next, { shouldDirty: true, shouldValidate: true })
          }
          error={errors.tags?.message}
        />

        <CoursePriceSection
          amount={watchedPrice}
          currencySymbol={priceCurrencySymbol}
          error={errors.price?.message}
          disabled={isFormDisabled}
          onChangeAmount={(value) =>
            setValue('price', value, { shouldDirty: true, shouldValidate: true })
          }
          onChangeCurrencySymbol={setPriceCurrencySymbol}
        />

        <CourseDurationSection
          durationMinutes={computedDurationMinutes}
          videoLessonsCount={watchedVideoLessonsCount}
        />

        <CourseCreateActions
          isCreating={isCreatingCourse}
          error={createCourseError}
          mode={mode}
          canCreate={canCreate}
          canUpdate={canUpdate}
          isUpdating={isUpdatingCourse}
          onCreateCourse={handleSubmit(handleCreateCourseSubmit)}
          onUpdateCourse={runCourseUpdate}
        />

        <input type="hidden" value={coverFile ? coverFile.name : ''} readOnly />
      </form>
    </Container>
  </Section>
);

export default CourseEditorCourseFormTab;
