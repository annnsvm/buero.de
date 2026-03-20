import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { apiInstance } from '@/api/apiInstance';
import { Container, Section, Text, Title } from '@/components/layout';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import CourseStructureAside from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside';
import CourseCoverSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCoverSection';
import CourseDetailsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDetailsSection';
import CourseTagsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseTagsSection';
import CoursePriceSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CoursePriceSection';
import CourseDurationSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDurationSection';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';
import CourseCreateActions from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCreateActions';
import CreateCourseModuleModal from '@/features/course-managment/components/CourseManagementWorkspace/CreateCourseModuleModal';
import CourseMaterialCreateTab from '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial';
import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/course-managment/validation/createCourseSchema';
import {
  countVideoLessonMaterials,
  sumVideoDurationMinutesAcrossModules,
} from '@/features/course-managment/helpers/courseTreeStats.helpers';
import type {
  CourseEntityDeleteTarget,
  CourseManagementRightTab,
  CourseModuleModalMode,
} from '@/types/features/courseManagment/CourseManagementPage.types';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import ConfirmDeleteEntityModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmDeleteEntityModal';
import {
  buildDeleteCourseDescription,
  buildDeleteMaterialDescription,
  buildDeleteModuleDescription,
} from '@/features/course-managment/helpers/courseEntityDeleteCopy.helpers';
import { countModuleMaterialsByKind } from '@/features/course-managment/helpers/courseModuleMaterialCounts.helpers';

const CourseManagmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Modules[]>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      title: '',
      description: '',
      language: 'en',
      category: 'language',
      price: '',
      durationHours: '',
      tags: [],
      level: '',
    },
  });

  const watchedTitle = watch('title') ?? '';
  const watchedDescription = watch('description') ?? '';
  const watchedTags = watch('tags') ?? [];
  const watchedPrice = watch('price') ?? '';
  const watchedLevel = watch('level') ?? '';
  const watchedVideoLessonsCount = countVideoLessonMaterials(modules);
  const computedDurationMinutes = sumVideoDurationMinutesAcrossModules(modules);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [priceCurrencySymbol, setPriceCurrencySymbol] = useState<CurrencySymbol>('€');

  const [courseId, setCourseId] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState<string | null>(null);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState<CourseModuleModalMode>('create');
  const [activeModuleIdForEdit, setActiveModuleIdForEdit] = useState<string | null>(null);
  const [moduleInitialTitle, setModuleInitialTitle] = useState('');
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<CourseManagementRightTab>('course');
  const [activeModuleIdForMaterial, setActiveModuleIdForMaterial] = useState<string | null>(null);
  const [activeMaterialIdForEdit, setActiveMaterialIdForEdit] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<CourseEntityDeleteTarget | null>(null);
  const [isDeletingEntity, setIsDeletingEntity] = useState(false);

  const activeModuleTitle =
    modules.find((m) => m.id === activeModuleIdForMaterial)?.title ?? 'No module selected';

  const fetchCourseTree = useCallback(async (id: string) => {
    const res = await apiInstance.get<{ modules?: Modules[] }>(API_ENDPOINTS.courses.byId(id));
    setModules(res.data.modules ?? []);
  }, []);

  const isFormDisabled = courseId !== null && !isEditingCourse;

  const canCreate = !courseId && !isCreatingCourse && !isUpdatingCourse;
  const canUpdate =
    !!courseId && isEditingCourse && !isCreatingCourse && !isUpdatingCourse && isDirty && isValid;

  const handleCreateCourseSubmit = async (values: CreateCourseFormValues) => {
    setCreateCourseError(null);
    setIsCreatingCourse(true);

    try {
      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        language: values.language,
        category: values.category,
        is_published: false,
        tags: values.tags,
        price: Number(values.price.trim()),
        level: values.level,
        ...(values.durationHours?.trim()
          ? { duration_hours: Number(values.durationHours.trim()) }
          : {}),
      };

      const res = await apiInstance.post<{ id: string }>(API_ENDPOINTS.courses.create, payload);
      setCourseId(res.data.id);
      setIsEditingCourse(false);
      setCreateCourseError(null);
      reset(values);
      await fetchCourseTree(res.data.id);
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

  const handleUpdateCourseSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return;

    setCreateCourseError(null);
    setIsUpdatingCourse(true);

    try {
      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        language: values.language,
        category: values.category,
        tags: values.tags,
        price: Number(values.price.trim()),
        level: values.level,
        ...(values.durationHours?.trim()
          ? { duration_hours: Number(values.durationHours.trim()) }
          : {}),
      };

      await apiInstance.patch(API_ENDPOINTS.courses.update(courseId), payload);
      reset(values);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Failed to update course';
      setCreateCourseError(Array.isArray(message) ? message.join(', ') : String(message));
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const handleFormSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return handleCreateCourseSubmit(values);
    if (!isEditingCourse) return;
    return handleUpdateCourseSubmit(values);
  };

  const handleRequestDeleteModule = useCallback((moduleId: string, moduleTitle: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    const { videoLessons, quizzes, other } = countModuleMaterialsByKind(mod?.materials);
    setDeleteTarget({
      kind: 'module',
      moduleId,
      moduleTitle,
      videoLessons,
      quizzes,
      otherMaterials: other,
    });
  }, [modules]);

  const handleRequestDeleteMaterial = useCallback(
    (moduleId: string, materialId: string) => {
      const mod = modules.find((m) => m.id === moduleId);
      const mat = mod?.materials.find((m) => m.id === materialId);
      if (!mat) return;
      const materialKind: 'video' | 'quiz' | 'other' =
        mat.type === 'video' ? 'video' : mat.type === 'quiz' ? 'quiz' : 'other';
      setDeleteTarget({
        kind: 'material',
        moduleId,
        materialId,
        title: mat.title ?? '',
        materialKind,
      });
    },
    [modules],
  );

  const handleConfirmDelete = async () => {
    const target = deleteTarget;
    const cid = courseId;
    if (!target || !cid) return;

    setIsDeletingEntity(true);
    try {
      if (target.kind === 'course') {
        await apiInstance.delete(API_ENDPOINTS.courses.delete(cid));
        navigate(ROUTES.COURSES);
        setCourseId(null);
        setModules([]);
        setActiveModuleIdForMaterial(null);
        setActiveMaterialIdForEdit(null);
        setActiveRightTab('course');
        setIsEditingCourse(false);
        setCreateCourseError(null);
        setCoverFile(null);
        setCoverPreviewUrl(null);
        reset({
          title: '',
          description: '',
          language: 'en',
          category: 'language',
          price: '',
          durationHours: '',
          tags: [],
          level: '',
        });
        return;
      }

      if (target.kind === 'module') {
        await apiInstance.delete(API_ENDPOINTS.courseModules.delete(cid, target.moduleId));
        setModules((prev) => prev.filter((m) => m.id !== target.moduleId));
        if (activeModuleIdForMaterial === target.moduleId) {
          setActiveModuleIdForMaterial(null);
          setActiveMaterialIdForEdit(null);
          setActiveRightTab('course');
        }
        return;
      }

      await apiInstance.delete(
        API_ENDPOINTS.courseMaterials.delete(cid, target.moduleId, target.materialId),
      );
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== target.moduleId) return m;
          return {
            ...m,
            materials: (m.materials ?? []).filter((mat) => mat.id !== target.materialId),
          };
        }),
      );
      if (activeMaterialIdForEdit === target.materialId) {
        setActiveMaterialIdForEdit(null);
      }
    } finally {
      setIsDeletingEntity(false);
    }
  };

  const deleteModalCopy = useMemo(() => {
    if (!deleteTarget) {
      return { title: '', description: '' };
    }
    if (deleteTarget.kind === 'course') {
      return {
        title: 'Delete course?',
        description: buildDeleteCourseDescription(deleteTarget.moduleCount),
      };
    }
    if (deleteTarget.kind === 'module') {
      return {
        title: `Delete module "${deleteTarget.moduleTitle.trim() || 'Untitled'}"?`,
        description: buildDeleteModuleDescription({
          videoLessons: deleteTarget.videoLessons,
          quizzes: deleteTarget.quizzes,
          otherMaterials: deleteTarget.otherMaterials,
        }),
      };
    }
    return {
      title: 'Delete material?',
      description: buildDeleteMaterialDescription({
        title: deleteTarget.title,
        kind: deleteTarget.materialKind,
      }),
    };
  }, [deleteTarget]);

  return (
    <div>
      <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
        <CourseStructureAside
          modules={modules}
          courseId={courseId}
          courseTitle={watchedTitle}
          onSelectCourse={() => {
            setIsEditingCourse(true);
            setActiveRightTab('course');
          }}
          onCreateModule={() => {
            if (!courseId) return;
            setModuleModalMode('create');
            setActiveModuleIdForEdit(null);
            setModuleInitialTitle('');
            setIsCreateModuleOpen(true);
          }}
          onEditModule={(moduleId, moduleTitle) => {
            if (!courseId) return;
            setModuleModalMode('edit');
            setActiveModuleIdForEdit(moduleId);
            setModuleInitialTitle(moduleTitle);
            setIsCreateModuleOpen(true);
          }}
          onCreateMaterial={(moduleId) => {
            if (!courseId) return;
            setActiveModuleIdForMaterial(moduleId);
            setActiveMaterialIdForEdit(null);
            setActiveRightTab('material');
          }}
          onSelectMaterial={(moduleId, materialId) => {
            if (!courseId) return;
            setActiveModuleIdForMaterial(moduleId);
            setActiveMaterialIdForEdit(materialId);
            setActiveRightTab('material');
          }}
          onRequestDeleteCourse={
            courseId
              ? () =>
                  setDeleteTarget({
                    kind: 'course',
                    moduleCount: modules.length,
                  })
              : undefined
          }
          onRequestDeleteModule={courseId ? handleRequestDeleteModule : undefined}
          onRequestDeleteMaterial={courseId ? handleRequestDeleteMaterial : undefined}
        />

        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="fixed top-0 z-10 flex w-full justify-center lg:justify-start border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)] px-4 lg:px-10 py-8 ">
            <NavLink
              to={ROUTES.COURSES}
              className="text-[var(--color-text-primary)] text-[1.25rem] hover:text-[var(--color-primary)]"
            >
              All courses
            </NavLink>
          </div>
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
          <Section className="py-8">
            <Container className="max-w-[1100px] px-4 sm:px-6">
              {activeRightTab === 'course' ? (
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
                    level={watchedLevel}
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
                    onChangeLevel={(value) =>
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
                    mode={courseId ? 'edit' : 'create'}
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    isUpdating={isUpdatingCourse}
                    onCreateCourse={handleSubmit(handleCreateCourseSubmit)}
                    onUpdateCourse={handleSubmit(handleUpdateCourseSubmit)}
                  />

                  <input type="hidden" value={coverFile ? coverFile.name : ''} readOnly />
                </form>
              ) : (
                <CourseMaterialCreateTab
                  key={`${activeModuleIdForMaterial ?? 'module-none'}:${activeMaterialIdForEdit ?? 'material-new'}`}
                  modules={modules}
                  activeModuleId={activeModuleIdForMaterial}
                  activeMaterialId={activeMaterialIdForEdit}
                  isSubmitting={isCreatingMaterial}
                  onRequestDeleteMaterial={
                    courseId && activeModuleIdForMaterial && activeMaterialIdForEdit
                      ? () =>
                          handleRequestDeleteMaterial(
                            activeModuleIdForMaterial,
                            activeMaterialIdForEdit,
                          )
                      : undefined
                  }
                  onCreate={async (payload: CreateCourseMaterialModalValues) => {
                    if (!courseId || !activeModuleIdForMaterial) {
                      throw new Error('Course or module is not selected');
                    }
                    setIsCreatingMaterial(true);
                    try {
                      const targetModule = modules.find((m) => m.id === activeModuleIdForMaterial);
                      const nextOrderIndex = targetModule?.materials?.length ?? 0;

                      const content =
                        payload.type === 'video'
                          ? {
                              youtube_video_id: payload.youtubeVideoId,
                              duration: payload.youtubeVideoDuration,
                            }
                          : {
                              questions: payload.quizQuestions.map((questionItem, qIdx) => {
                                const normalizedQuestionId = questionItem.id || `q${qIdx + 1}`;
                                const options = questionItem.answers.map((answerItem, aIdx) => ({
                                  id: answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
                                  text: answerItem.text,
                                }));
                                const correctIds = questionItem.answers
                                  .filter((answerItem) => answerItem.isCorrect)
                                  .map(
                                    (answerItem, aIdx) =>
                                      answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
                                  );
                                return {
                                  id: normalizedQuestionId,
                                  text: questionItem.question,
                                  options,
                                  correct:
                                    correctIds.length > 1 ? correctIds : (correctIds[0] ?? ''),
                                };
                              }),
                            };

                      const created = await apiInstance.post<{ id: string }>(
                        API_ENDPOINTS.courseMaterials.create(courseId, activeModuleIdForMaterial),
                        {
                          type: payload.type,
                          title: payload.title,
                          content,
                          order_index: nextOrderIndex,
                        },
                      );

                      setModules((prev) =>
                        prev.map((m) => {
                          if (m.id !== activeModuleIdForMaterial) return m;
                          return {
                            ...m,
                            materials: [
                              ...(m.materials ?? []),
                              {
                                id: created.data.id,
                                type: payload.type,
                                title: payload.title,
                                content,
                                orderIndex: nextOrderIndex,
                              },
                            ],
                          };
                        }),
                      );
                      setActiveMaterialIdForEdit(created.data.id);
                      return { id: created.data.id };
                    } finally {
                      setIsCreatingMaterial(false);
                    }
                  }}
                  onUpdate={async (
                    materialId: string,
                    payload: CreateCourseMaterialModalValues,
                  ) => {
                    if (!courseId || !activeModuleIdForMaterial) return;
                    setIsCreatingMaterial(true);
                    try {
                      const content =
                        payload.type === 'video'
                          ? {
                              youtube_video_id: payload.youtubeVideoId,
                              duration: payload.youtubeVideoDuration,
                            }
                          : {
                              questions: payload.quizQuestions.map((questionItem, qIdx) => {
                                const normalizedQuestionId = questionItem.id || `q${qIdx + 1}`;
                                const options = questionItem.answers.map((answerItem, aIdx) => ({
                                  id: answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
                                  text: answerItem.text,
                                }));
                                const correctIds = questionItem.answers
                                  .filter((answerItem) => answerItem.isCorrect)
                                  .map(
                                    (answerItem, aIdx) =>
                                      answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
                                  );
                                return {
                                  id: normalizedQuestionId,
                                  text: questionItem.question,
                                  options,
                                  correct:
                                    correctIds.length > 1 ? correctIds : (correctIds[0] ?? ''),
                                };
                              }),
                            };

                      await apiInstance.patch(
                        API_ENDPOINTS.courseMaterials.update(
                          courseId,
                          activeModuleIdForMaterial,
                          materialId,
                        ),
                        {
                          type: payload.type,
                          title: payload.title,
                          content,
                        },
                      );

                      setModules((prev) =>
                        prev.map((m) => {
                          if (m.id !== activeModuleIdForMaterial) return m;
                          return {
                            ...m,
                            materials: (m.materials ?? []).map((mat) => {
                              if (mat.id !== materialId) return mat;
                              return {
                                ...mat,
                                type: payload.type,
                                title: payload.title,
                                content,
                              };
                            }),
                          };
                        }),
                      );
                    } finally {
                      setIsCreatingMaterial(false);
                    }
                  }}
                />
              )}
            </Container>
          </Section>
        </div>
      </div>

      <CreateCourseModuleModal
        key={`${moduleModalMode}:${activeModuleIdForEdit ?? 'new'}`}
        isOpen={isCreateModuleOpen}
        mode={moduleModalMode}
        initialTitle={moduleInitialTitle}
        handleOpenChange={(open) => {
          if (!open) setIsCreateModuleOpen(false);
          else setIsCreateModuleOpen(open);
        }}
        onSubmitModule={async ({ title }) => {
          if (!courseId) return;

          if (moduleModalMode === 'edit') {
            if (!activeModuleIdForEdit) return;
            await apiInstance.patch(
              API_ENDPOINTS.courseModules.update(courseId, activeModuleIdForEdit),
              {
                title,
              },
            );
            setModules((prev) =>
              prev.map((m) => (m.id === activeModuleIdForEdit ? { ...m, title } : m)),
            );
            return;
          }

          const currentOrders = modules.map((m) => m.orderIndex ?? 0);
          const nextOrderIndex = currentOrders.length ? Math.max(...currentOrders) + 1 : 0;
          await apiInstance.post(API_ENDPOINTS.courseModules.create(courseId), {
            title,
            order_index: nextOrderIndex,
          });
          await fetchCourseTree(courseId);
        }}
      />

      <ConfirmDeleteEntityModal
        isOpen={deleteTarget !== null}
        handleOpenChange={(open) => {
          if (!open && !isDeletingEntity) setDeleteTarget(null);
        }}
        title={deleteModalCopy.title}
        description={deleteModalCopy.description}
        isSubmitting={isDeletingEntity}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CourseManagmentPage;
