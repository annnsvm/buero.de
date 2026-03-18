import React, { useMemo, useState } from 'react';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { apiInstance } from '@/api/apiInstance';
import { Container, Section, Text, Title } from '@/components/layout';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import CourseStructureAside from './parts/CourseStructureAside';
import CourseCoverSection from './parts/CourseCoverSection';
import CourseDetailsSection from './parts/CourseDetailsSection';
import CourseTagsSection from './parts/CourseTagsSection';
import CoursePriceSection, { type CurrencySymbol } from './parts/CoursePriceSection';
import CourseCreateActions from './parts/CourseCreateActions';

const CourseManagementWorkspace: React.FC = () => {
  const modules: Modules[] = useMemo(() => [], []);

  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>(['Grammar', 'Vocabulary', 'A1']);

  const [priceAmount, setPriceAmount] = useState<string>('');
  const [priceCurrencySymbol, setPriceCurrencySymbol] = useState<CurrencySymbol>('€');

  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState<string | null>(null);

  const handleCreateCourse = async () => {
    setCreateCourseError(null);
    if (!courseName.trim()) {
      setCreateCourseError('Course name is required');
      return;
    }

    setIsCreatingCourse(true);
    try {
      const res = await apiInstance.post<{ id: string }>(API_ENDPOINTS.courses.create, {
        title: courseName.trim(),
        description: courseDescription.trim() || undefined,
        language: 'en',
        category: 'language',
        is_published: false,
      });
      setCreatedCourseId(res.data.id);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Failed to create course';
      setCreateCourseError(Array.isArray(message) ? message.join(', ') : String(message));
    } finally {
      setIsCreatingCourse(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-section)] pt-16">
      <CourseStructureAside modules={modules} createdCourseId={createdCourseId} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0">
          <Container className="py-6">
            <div className="flex w-full flex-col items-center gap-2 text-[var(--color-neutral-darkest)]">
              <Title className="text-center text-[2rem] sm:text-[3rem] lg:text-[3.75rem]">
                {courseName.trim() ? courseName.trim() : 'New course'}
              </Title>
              <Text
                className="text-center text-[0.9rem] sm:text-[0.9rem] lg:text-[1.25rem]"
                label="create course text"
              >
                {courseDescription.trim()
                  ? courseDescription.trim()
                  : 'Add a description to help students understand what they will learn.'}
              </Text>
            </div>
          </Container>
        </header>

        <main className="min-w-0 flex-1">
          <Section className="py-8">
            <Container className="max-w-[1100px]">
              <div className="space-y-6">
                <CourseCoverSection
                  coverPreviewUrl={coverPreviewUrl}
                  disabled={!!createdCourseId}
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
                  courseName={courseName}
                  courseDescription={courseDescription}
                  disabled={!!createdCourseId}
                  onChangeName={setCourseName}
                  onChangeDescription={setCourseDescription}
                />

                <CourseTagsSection
                  tags={tags}
                  disabled={!!createdCourseId}
                  onChangeTags={setTags}
                />

                <CoursePriceSection
                  amount={priceAmount}
                  currencySymbol={priceCurrencySymbol}
                  disabled={!!createdCourseId}
                  onChangeAmount={setPriceAmount}
                  onChangeCurrencySymbol={setPriceCurrencySymbol}
                />

                {!isCreatingCourse && (
                  <CourseCreateActions
                    isCreating={isCreatingCourse}
                    createdCourseId={createdCourseId}
                    error={createCourseError}
                    canCreate={!!courseName.trim() && !createdCourseId}
                    onCreateCourse={handleCreateCourse}
                  />
                )}
                <input type="hidden" value={coverFile ? coverFile.name : ''} readOnly />
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default CourseManagementWorkspace;
