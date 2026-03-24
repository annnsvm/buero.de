import React from 'react';

import CourseStructureAside from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside';
import { useCourseEditor } from '@/features/course-managment/course-editor/hooks/useCourseEditor';
import CourseEditorLoadingScreen from '@/features/course-managment/course-editor/components/CourseEditorLoadingScreen';
import CourseEditorShell from '@/features/course-managment/course-editor/components/CourseEditorShell';
import CourseEditorHeader from '@/features/course-managment/course-editor/components/CourseEditorHeader';
import CourseEditorCourseFormTab from '@/features/course-managment/course-editor/components/CourseEditorCourseFormTab';
import CourseEditorMaterialPanel from '@/features/course-managment/course-editor/components/CourseEditorMaterialPanel';
import CourseEditorModals from '@/features/course-managment/course-editor/components/CourseEditorModals';

const CourseManagmentPage: React.FC = () => {
  const editor = useCourseEditor();

  if (editor.showBootstrapLoading) {
    return <CourseEditorLoadingScreen />;
  }

  return (
    <div>
      <CourseEditorShell aside={<CourseStructureAside {...editor.asideProps} />}>
        <CourseEditorHeader {...editor.headerProps} />
        {editor.activeRightTab === 'course' ? (
          <CourseEditorCourseFormTab {...editor.courseFormProps} />
        ) : (
          <CourseEditorMaterialPanel {...editor.materialPanelProps} />
        )}
      </CourseEditorShell>

      <CourseEditorModals
        createModuleModalProps={editor.createModuleModalProps}
        deleteModalProps={editor.deleteModalProps}
        publishModalProps={editor.publishModalProps}
        unpublishModalProps={editor.unpublishModalProps}
        createModuleModalKey={editor.createModuleModalKey}
      />
    </div>
  );
};

export default CourseManagmentPage;
