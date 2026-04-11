import React from 'react';
import { Container, Section } from '@/components/layout';
import CourseMaterialCreateTab from '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial';
import type { CourseEditorMaterialPanelProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorMaterialPanel: React.FC<CourseEditorMaterialPanelProps> = ({
  modules,
  activeModuleIdForMaterial,
  activeMaterialIdForEdit,
  isCreatingMaterial,
  onRequestDeleteMaterial,
  onCreate,
  onUpdate,
}) => (
  <Section className="py-8">
    <Container className="max-w-[1100px] px-4 sm:px-6">
      <CourseMaterialCreateTab
        key={`${activeModuleIdForMaterial ?? 'module-none'}:${activeMaterialIdForEdit ?? 'material-new'}`}
        modules={modules}
        activeModuleId={activeModuleIdForMaterial}
        activeMaterialId={activeMaterialIdForEdit}
        isSubmitting={isCreatingMaterial}
        onRequestDeleteMaterial={onRequestDeleteMaterial}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </Container>
  </Section>
);

export default CourseEditorMaterialPanel;
