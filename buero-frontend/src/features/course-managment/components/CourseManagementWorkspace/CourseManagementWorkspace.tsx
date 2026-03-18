import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/course-managment/validation/createCourseSchema';

const CourseManagementWorkspace: React.FC = () => {
  const modules: Modules[] = useMemo(() => [], []);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      language: 'en',
      category: 'language',
      price: '',
      tags: ['Grammar', 'Vocabulary', 'A1'],
    },
  });

  const watchedTitle = watch('title') ?? '';
  const watchedDescription = watch('description') ?? '';
  const watchedTags = watch('tags') ?? [];
  const watchedPrice = watch('price') ?? '';

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [priceCurrencySymbol, setPriceCurrencySymbol] = useState<CurrencySymbol>('€');

  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState<string | null>(null);

  const onSubmit = async (values: CreateCourseFormValues) => {
    setCreateCourseError(null);
    setIsCreatingCourse(true);
    try {
      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        language: values.language,
        category: values.category,
        is_published: false,
        tags: values.tags,
      };

      if (values.price?.trim()) {
        payload.price = Number(values.price.trim());
      }

      const res = await apiInstance.post<{ id: string }>(API_ENDPOINTS.courses.create, payload);
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
                {watchedTitle.trim() ? watchedTitle.trim() : 'New course'}
              </Title>
              <Text
                className="text-center text-[0.9rem] sm:text-[0.9rem] lg:text-[1.25rem]"
                label="create course text"
              >
                {watchedDescription.trim()
                  ? watchedDescription.trim()
                  : 'Add a description to help students understand what they will learn.'}
              </Text>
            </div>
          </Container>
        </header>

        <main className="min-w-0 flex-1">
          <Section className="py-8">
            <Container className="max-w-[1100px]">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  courseName={watchedTitle}
                  courseDescription={watchedDescription}
                  nameError={errors.title?.message}
                  descriptionError={errors.description?.message}
                  disabled={!!createdCourseId}
                  onChangeName={(value) => setValue('title', value)}
                  onChangeDescription={(value) => setValue('description', value)}
                />

                <CourseTagsSection
                  tags={watchedTags}
                  disabled={!!createdCourseId}
                  onChangeTags={(next) => setValue('tags', next)}
                />

                <CoursePriceSection
                  amount={watchedPrice}
                  currencySymbol={priceCurrencySymbol}
                  error={errors.price?.message}
                  disabled={!!createdCourseId}
                  onChangeAmount={(value) => setValue('price', value)}
                  onChangeCurrencySymbol={setPriceCurrencySymbol}
                />

                <CourseCreateActions
                  isCreating={isCreatingCourse}
                  createdCourseId={createdCourseId}
                  error={createCourseError}
                  canCreate={!isCreatingCourse}
                  onCreateCourse={handleSubmit(onSubmit)}
                />

                <input type="hidden" value={coverFile ? coverFile.name : ''} readOnly />
              </form>
            </Container>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default CourseManagementWorkspace;
