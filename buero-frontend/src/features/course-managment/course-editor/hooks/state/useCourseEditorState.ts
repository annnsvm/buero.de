import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/course-managment/validation/createCourseSchema';
import { totalMaterialCount } from '@/features/course-managment/domain/totalMaterialCount';
import { videoMaterialCount } from '@/features/course-managment/domain/videoMaterialCount';
import { videoMinutesSum } from '@/features/course-managment/domain/videoMinutesSum';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type {
  CourseEntityDeleteTarget,
  CourseManagementRightTab,
  CourseModuleModalMode,
} from '@/types/features/courseManagment/CourseManagementPage.types';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';

export const useCourseEditorState = () => {
  const [modules, setModules] = useState<Modules[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isCoursePublished, setIsCoursePublished] = useState(false);

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
  const watchedVideoLessonsCount = videoMaterialCount(modules);
  const computedDurationMinutes = videoMinutesSum(modules);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [priceCurrencySymbol, setPriceCurrencySymbol] = useState<CurrencySymbol>('€');

  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState<string | null>(null);
  const [lastCourseCommitKind, setLastCourseCommitKind] = useState<'create' | 'update' | null>(
    null,
  );

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

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishingCourse, setIsPublishingCourse] = useState(false);

  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false);
  const [isUnpublishingCourse, setIsUnpublishingCourse] = useState(false);

  const [isBootstrappingCourse, setIsBootstrappingCourse] = useState(false);

  const totalMaterialsCount = useMemo(
    () => totalMaterialCount(modules),
    [modules],
  );

  const activeModuleTitle =
    modules.find((m) => m.id === activeModuleIdForMaterial)?.title ?? 'No module selected';

  const isFormDisabled = courseId !== null && !isEditingCourse;
  const canCreate = !courseId && !isCreatingCourse && !isUpdatingCourse;
  const canUpdate =
    !!courseId &&
    isEditingCourse &&
    !isCreatingCourse &&
    !isUpdatingCourse &&
    ((isDirty && isValid) || coverFile !== null);

  const resetEditorToEmpty = useCallback(() => {
    setCourseId(null);
    setModules([]);
    setIsEditingCourse(false);
    setIsCoursePublished(false);
    setCreateCourseError(null);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    setActiveModuleIdForMaterial(null);
    setActiveMaterialIdForEdit(null);
    setActiveRightTab('course');
    setLastCourseCommitKind(null);
    setDeleteTarget(null);
    setIsPublishModalOpen(false);
    setIsCreateModuleOpen(false);
    setModuleModalMode('create');
    setActiveModuleIdForEdit(null);
    setModuleInitialTitle('');
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
  }, [reset]);

  return {
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    isDirty,
    isValid,
    courseId,
    setCourseId,
    modules,
    setModules,
    isCoursePublished,
    setIsCoursePublished,
    watchedTitle,
    watchedDescription,
    watchedTags,
    watchedPrice,
    watchedLevel,
    watchedVideoLessonsCount,
    computedDurationMinutes,
    coverFile,
    setCoverFile,
    coverPreviewUrl,
    setCoverPreviewUrl,
    priceCurrencySymbol,
    setPriceCurrencySymbol,
    isEditingCourse,
    setIsEditingCourse,
    isCreatingCourse,
    setIsCreatingCourse,
    isUpdatingCourse,
    setIsUpdatingCourse,
    lastCourseCommitKind,
    setLastCourseCommitKind,
    createCourseError,
    setCreateCourseError,
    isFormDisabled,
    canCreate,
    canUpdate,
    isCreateModuleOpen,
    setIsCreateModuleOpen,
    moduleModalMode,
    setModuleModalMode,
    activeModuleIdForEdit,
    setActiveModuleIdForEdit,
    moduleInitialTitle,
    setModuleInitialTitle,
    isCreatingMaterial,
    setIsCreatingMaterial,
    activeRightTab,
    setActiveRightTab,
    activeModuleIdForMaterial,
    setActiveModuleIdForMaterial,
    activeMaterialIdForEdit,
    setActiveMaterialIdForEdit,
    deleteTarget,
    setDeleteTarget,
    isDeletingEntity,
    setIsDeletingEntity,
    isPublishModalOpen,
    setIsPublishModalOpen,
    isPublishingCourse,
    setIsPublishingCourse,
    isUnpublishModalOpen,
    setIsUnpublishModalOpen,
    isUnpublishingCourse,
    setIsUnpublishingCourse,
    isBootstrappingCourse,
    setIsBootstrappingCourse,
    totalMaterialsCount,
    activeModuleTitle,
    resetEditorToEmpty,
  };
};
