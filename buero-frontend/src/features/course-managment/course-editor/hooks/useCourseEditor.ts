import { useCallback } from 'react';

import { useCourseEditorEffects } from './effects/useCourseEditorEffects';
import { useCourseEditorHandlers } from './handlers/useCourseEditorHandlers';
import { useCourseEditorRouter } from './router/useCourseEditorRouter';
import { useCourseEditorState } from './state/useCourseEditorState';
import { useCourseEditorTree } from './tree/useCourseEditorTree';

export const useCourseEditor = () => {
  const router = useCourseEditorRouter();
  const state = useCourseEditorState();
  const tree = useCourseEditorTree({
    setValue: state.setValue,
    setModules: state.setModules,
    setIsCoursePublished: state.setIsCoursePublished,
  });

  useCourseEditorEffects({
    pathname: router.location.pathname,
    routeCourseId: router.routeCourseId,
    state,
    tree,
  });

  const handlers = useCourseEditorHandlers({ state, tree, router });

  const {
    modules,
    courseId,
    isCoursePublished,
    setIsEditingCourse,
    handleSubmit,
    isDirty,
    errors,
    isFormDisabled,
    canCreate,
    canUpdate,
    isCreatingCourse,
    isUpdatingCourse,
    lastCourseCommitKind,
    createCourseError,
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
    coverPreviewUrl,
    activeRightTab,
    setActiveRightTab,
    activeModuleIdForMaterial,
    setActiveModuleIdForMaterial,
    activeMaterialIdForEdit,
    setActiveMaterialIdForEdit,
    isCreateModuleOpen,
    setIsCreateModuleOpen,
    moduleModalMode,
    setModuleModalMode,
    activeModuleIdForEdit,
    setActiveModuleIdForEdit,
    moduleInitialTitle,
    setModuleInitialTitle,
    isCreatingMaterial,
    isPublishModalOpen,
    setIsPublishModalOpen,
    isPublishingCourse,
    isUnpublishModalOpen,
    setIsUnpublishModalOpen,
    isUnpublishingCourse,
    isBootstrappingCourse,
    totalMaterialsCount,
    activeModuleTitle,
    deleteTarget,
    setDeleteTarget,
    isDeletingEntity,
  } = state;

  const {
    handleFormSubmit,
    handleCreateCourseSubmit,
    handleUpdateCourseSubmit,
    submitCourseCoverOnly,
    handleRequestDeleteModule,
    handleRequestDeleteMaterial,
    handleConfirmDelete,
    deleteModalCopy,
    handleMaterialCreate,
    handleMaterialUpdate,
    handleSubmitModuleModal,
    handleConfirmPublishCourse,
    handleConfirmUnpublishCourse,
  } = handlers;

  const runCourseUpdate = useCallback(() => {
    if (coverFile !== null && !isDirty) {
      void submitCourseCoverOnly();
      return;
    }
    void handleSubmit(handleUpdateCourseSubmit)();
  }, [
    coverFile,
    isDirty,
    handleSubmit,
    handleUpdateCourseSubmit,
    submitCourseCoverOnly,
  ]);

  const showBootstrapLoading = Boolean(router.routeCourseId && isBootstrappingCourse);

  return {
    showBootstrapLoading,
    asideProps: {
      modules,
      courseId,
      courseTitle: watchedTitle,
      onSelectCourse: () => {
        setIsEditingCourse(true);
        setActiveRightTab('course');
      },
      onCreateModule: () => {
        if (!courseId) return;
        setModuleModalMode('create');
        setActiveModuleIdForEdit(null);
        setModuleInitialTitle('');
        setIsCreateModuleOpen(true);
      },
      onEditModule: (moduleId: string, moduleTitle: string) => {
        if (!courseId) return;
        setModuleModalMode('edit');
        setActiveModuleIdForEdit(moduleId);
        setModuleInitialTitle(moduleTitle);
        setIsCreateModuleOpen(true);
      },
      onCreateMaterial: (moduleId: string) => {
        if (!courseId) return;
        setActiveModuleIdForMaterial(moduleId);
        setActiveMaterialIdForEdit(null);
        setActiveRightTab('material');
      },
      onSelectMaterial: (moduleId: string, materialId: string) => {
        if (!courseId) return;
        setActiveModuleIdForMaterial(moduleId);
        setActiveMaterialIdForEdit(materialId);
        setActiveRightTab('material');
      },
      onRequestDeleteCourse: courseId
        ? () =>
            setDeleteTarget({
              kind: 'course',
              moduleCount: modules.length,
            })
        : undefined,
      onRequestDeleteModule: courseId ? handleRequestDeleteModule : undefined,
      onRequestDeleteMaterial: courseId ? handleRequestDeleteMaterial : undefined,
      showPublishCourseButton:
        Boolean(courseId) && totalMaterialsCount > 0 && !isCoursePublished,
      onRequestPublishCourse: () => setIsPublishModalOpen(true),
      showUnpublishCourseButton: Boolean(courseId) && isCoursePublished,
      onRequestUnpublishCourse: () => setIsUnpublishModalOpen(true),
    },
    headerProps: {
      watchedTitle,
      watchedDescription,
      activeRightTab,
      activeModuleTitle,
    },
    courseFormProps: {
      mode: courseId ? ('edit' as const) : ('create' as const),
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
      lastCourseCommitKind,
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
    },
    materialPanelProps: {
      modules,
      activeModuleIdForMaterial,
      activeMaterialIdForEdit,
      isCreatingMaterial,
      onRequestDeleteMaterial:
        courseId && activeModuleIdForMaterial && activeMaterialIdForEdit
          ? () =>
              handleRequestDeleteMaterial(
                activeModuleIdForMaterial,
                activeMaterialIdForEdit,
              )
          : undefined,
      onCreate: handleMaterialCreate,
      onUpdate: handleMaterialUpdate,
    },
    activeRightTab,
    createModuleModalProps: {
      isOpen: isCreateModuleOpen,
      mode: moduleModalMode,
      initialTitle: moduleInitialTitle,
      handleOpenChange: (open: boolean) => {
        if (!open) setIsCreateModuleOpen(false);
        else setIsCreateModuleOpen(open);
      },
      onSubmitModule: handleSubmitModuleModal,
    },
    deleteModalProps: {
      isOpen: deleteTarget !== null,
      handleOpenChange: (open: boolean) => {
        if (!open && !isDeletingEntity) setDeleteTarget(null);
      },
      title: deleteModalCopy.title,
      description: deleteModalCopy.description,
      isSubmitting: isDeletingEntity,
      onConfirm: handleConfirmDelete,
    },
    publishModalProps: {
      isOpen: isPublishModalOpen,
      handleOpenChange: (open: boolean) => {
        if (!open && !isPublishingCourse) setIsPublishModalOpen(false);
      },
      isSubmitting: isPublishingCourse,
      onConfirm: handleConfirmPublishCourse,
    },
    unpublishModalProps: {
      isOpen: isUnpublishModalOpen,
      handleOpenChange: (open: boolean) => {
        if (!open && !isUnpublishingCourse) setIsUnpublishModalOpen(false);
      },
      isSubmitting: isUnpublishingCourse,
      onConfirm: handleConfirmUnpublishCourse,
    },
    createModuleModalKey: `${moduleModalMode}:${activeModuleIdForEdit ?? 'new'}`,
  };
};
