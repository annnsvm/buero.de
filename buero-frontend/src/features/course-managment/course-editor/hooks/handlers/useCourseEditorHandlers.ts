import { useCallback, useMemo } from 'react';

import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import { getTeacherCourseEditPath, ROUTES } from '@/helpers/routes';
import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

import * as courseApi from '@/api/courseManagementApi';
import { coverUrlFromApi } from '@/features/course-managment/domain/coverUrlFromApi';
import { courseCreatePayload } from '@/features/course-managment/domain/courseCreatePayload';
import { courseUpdatePayload } from '@/features/course-managment/domain/courseUpdatePayload';
import { deleteCourseCopy } from '@/features/course-managment/domain/deleteCourseCopy';
import { deleteMaterialCopy } from '@/features/course-managment/domain/deleteMaterialCopy';
import { deleteModuleCopy } from '@/features/course-managment/domain/deleteModuleCopy';
import { materialContentPayload } from '@/features/course-managment/domain/materialContentPayload';
import { materialKindCounts } from '@/features/course-managment/domain/materialKindCounts';
import { parseApiErrorMessage } from '@/helpers/parseApiErrorMessage';
import type { UseCourseEditorHandlersParams } from '@/types/features/courseManagment/CourseEditorHooksReturn.types';

export const useCourseEditorHandlers = ({
  state,
  tree,
  router,
}: UseCourseEditorHandlersParams) => {
  const { navigate } = router;
  const { syncCourseDurationHours, fetchCourseTree } = tree;

  const {
    courseId,
    modules,
    setModules,
    setIsCoursePublished,
    reset,
    setCreateCourseError,
    setIsCreatingCourse,
    setIsUpdatingCourse,
    setLastCourseCommitKind,
    isEditingCourse,
    setIsPublishingCourse,
    setIsUnpublishingCourse,
    deleteTarget,
    setDeleteTarget,
    setIsDeletingEntity,
    activeModuleIdForMaterial,
    setActiveModuleIdForMaterial,
    activeMaterialIdForEdit,
    setActiveMaterialIdForEdit,
    setActiveRightTab,
    moduleModalMode,
    activeModuleIdForEdit,
    setIsCreatingMaterial,
    resetEditorToEmpty,
    coverFile,
    setCoverFile,
    setCoverPreviewUrl,
  } = state;

  const handleCreateCourseSubmit = async (values: CreateCourseFormValues) => {
    setCreateCourseError(null);
    setIsCreatingCourse(true);

    try {
      const payload = courseCreatePayload(values);

      const res = await courseApi.createCourse(payload);
      const newCourseId = res.data.id;

      if (coverFile) {
        await courseApi.uploadCourseCover(newCourseId, coverFile);
      }

      setCoverFile(null);
      setCoverPreviewUrl(null);
      setCreateCourseError(null);
      navigate(getTeacherCourseEditPath(newCourseId), { replace: true });
    } catch (err: unknown) {
      setCreateCourseError(parseApiErrorMessage(err, 'Failed to create course'));
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleUpdateCourseSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return;

    setCreateCourseError(null);
    setIsUpdatingCourse(true);

    try {
      const payload = courseUpdatePayload(values);

      await courseApi.patchCourse(courseId, payload);

      if (coverFile) {
        const up = await courseApi.uploadCourseCover(courseId, coverFile);
        setCoverPreviewUrl(coverUrlFromApi(up.data));
      }

      setCoverFile(null);
      reset(values);
      setLastCourseCommitKind('update');
    } catch (err: unknown) {
      setCreateCourseError(parseApiErrorMessage(err, 'Failed to update course'));
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const submitCourseCoverOnly = useCallback(async () => {
    if (!courseId || !coverFile) return;

    setCreateCourseError(null);
    setIsUpdatingCourse(true);
    try {
      const up = await courseApi.uploadCourseCover(courseId, coverFile);
      setCoverFile(null);
      setCoverPreviewUrl(coverUrlFromApi(up.data));
      setLastCourseCommitKind('update');
    } catch (err: unknown) {
      setCreateCourseError(parseApiErrorMessage(err, 'Failed to upload cover'));
    } finally {
      setIsUpdatingCourse(false);
    }
  }, [
    courseId,
    coverFile,
    setCoverFile,
    setCoverPreviewUrl,
    setCreateCourseError,
    setIsUpdatingCourse,
    setLastCourseCommitKind,
  ]);

  const handleFormSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return handleCreateCourseSubmit(values);
    if (!isEditingCourse) return;
    return handleUpdateCourseSubmit(values);
  };

  const handleConfirmPublishCourse = async () => {
    const cid = courseId;
    if (!cid) return;
    setIsPublishingCourse(true);
    try {
      await courseApi.patchCourse(cid, { is_published: true });
      setIsCoursePublished(true);
    } finally {
      setIsPublishingCourse(false);
    }
  };

  const handleConfirmUnpublishCourse = async () => {
    const cid = courseId;
    if (!cid) return;
    setIsUnpublishingCourse(true);
    try {
      await courseApi.patchCourse(cid, { is_published: false });
      setIsCoursePublished(false);
    } finally {
      setIsUnpublishingCourse(false);
    }
  };

  const handleRequestDeleteModule = useCallback(
    (moduleId: string, moduleTitle: string) => {
      const mod = modules.find((m) => m.id === moduleId);
      const { videoLessons, quizzes, other } = materialKindCounts(mod?.materials);
      setDeleteTarget({
        kind: 'module',
        moduleId,
        moduleTitle,
        videoLessons,
        quizzes,
        otherMaterials: other,
      });
    },
    [modules, setDeleteTarget],
  );

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
    [modules, setDeleteTarget],
  );

  const handleConfirmDelete = async () => {
    const target = deleteTarget;
    const cid = courseId;
    if (!target || !cid) return;

    setIsDeletingEntity(true);
    try {
      if (target.kind === 'course') {
        await courseApi.deleteCourse(cid);
        resetEditorToEmpty();
        navigate(ROUTES.COURSES);
        return;
      }

      if (target.kind === 'module') {
        await courseApi.deleteModule(cid, target.moduleId);
        const nextModules = modules.filter((m) => m.id !== target.moduleId);
        setModules(nextModules);
        await syncCourseDurationHours(cid, nextModules);
        if (activeModuleIdForMaterial === target.moduleId) {
          setActiveModuleIdForMaterial(null);
          setActiveMaterialIdForEdit(null);
          setActiveRightTab('course');
        }
        return;
      }

      await courseApi.deleteMaterial(cid, target.moduleId, target.materialId);
      const nextModulesAfterMaterialDelete = modules.map((m) => {
        if (m.id !== target.moduleId) return m;
        return {
          ...m,
          materials: (m.materials ?? []).filter((mat) => mat.id !== target.materialId),
        };
      });
      setModules(nextModulesAfterMaterialDelete);
      await syncCourseDurationHours(cid, nextModulesAfterMaterialDelete);
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
        description: deleteCourseCopy(deleteTarget.moduleCount),
      };
    }
    if (deleteTarget.kind === 'module') {
      return {
        title: `Delete module "${deleteTarget.moduleTitle.trim() || 'Untitled'}"?`,
        description: deleteModuleCopy({
          videoLessons: deleteTarget.videoLessons,
          quizzes: deleteTarget.quizzes,
          otherMaterials: deleteTarget.otherMaterials,
        }),
      };
    }
    return {
      title: 'Delete material?',
      description: deleteMaterialCopy({
        title: deleteTarget.title,
        kind: deleteTarget.materialKind,
      }),
    };
  }, [deleteTarget]);

  const handleMaterialCreate = async (payload: CreateCourseMaterialModalValues) => {
    if (!courseId || !activeModuleIdForMaterial) {
      throw new Error('Course or module is not selected');
    }
    setIsCreatingMaterial(true);
    try {
      const targetModule = modules.find((m) => m.id === activeModuleIdForMaterial);
      const nextOrderIndex = targetModule?.materials?.length ?? 0;
      const content = materialContentPayload(payload);

      const created = await courseApi.createMaterial(courseId, activeModuleIdForMaterial, {
        type: payload.type,
        title: payload.title,
        content,
        order_index: nextOrderIndex,
      });

      const nextModulesAfterCreate = modules.map((m) => {
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
      });
      setModules(nextModulesAfterCreate);
      await syncCourseDurationHours(courseId, nextModulesAfterCreate);
      setActiveMaterialIdForEdit(created.data.id);
      return { id: created.data.id };
    } finally {
      setIsCreatingMaterial(false);
    }
  };

  const handleMaterialUpdate = async (
    materialId: string,
    payload: CreateCourseMaterialModalValues,
  ) => {
    if (!courseId || !activeModuleIdForMaterial) return;
    setIsCreatingMaterial(true);
    try {
      const content = materialContentPayload(payload);

      await courseApi.updateMaterial(courseId, activeModuleIdForMaterial, materialId, {
        type: payload.type,
        title: payload.title,
        content,
      });

      const nextModulesAfterUpdate = modules.map((m) => {
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
      });
      setModules(nextModulesAfterUpdate);
      await syncCourseDurationHours(courseId, nextModulesAfterUpdate);
    } finally {
      setIsCreatingMaterial(false);
    }
  };

  const handleSubmitModuleModal = async ({ title }: { title: string }) => {
    if (!courseId) return;

    if (moduleModalMode === 'edit') {
      if (!activeModuleIdForEdit) return;
      await courseApi.updateModule(courseId, activeModuleIdForEdit, {
        title,
      });
      setModules((prev) =>
        prev.map((m) => (m.id === activeModuleIdForEdit ? { ...m, title } : m)),
      );
      return;
    }

    const currentOrders = modules.map((m) => m.orderIndex ?? 0);
    const nextOrderIndex = currentOrders.length ? Math.max(...currentOrders) + 1 : 0;
    await courseApi.createModule(courseId, {
      title,
      order_index: nextOrderIndex,
    });
    await fetchCourseTree(courseId);
  };

  return {
    handleCreateCourseSubmit,
    handleUpdateCourseSubmit,
    submitCourseCoverOnly,
    handleFormSubmit,
    handleConfirmPublishCourse,
    handleConfirmUnpublishCourse,
    handleRequestDeleteModule,
    handleRequestDeleteMaterial,
    handleConfirmDelete,
    deleteModalCopy,
    handleMaterialCreate,
    handleMaterialUpdate,
    handleSubmitModuleModal,
  };
};
