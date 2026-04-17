export type CourseManagementRightTab = 'course' | 'material';

export type CourseModuleModalMode = 'create' | 'edit';

export type CourseEntityDeleteTarget =
  | { kind: 'course'; moduleCount: number }
  | {
      kind: 'module';
      moduleId: string;
      moduleTitle: string;
      videoLessons: number;
      quizzes: number;
      otherMaterials: number;
    }
  | {
      kind: 'material';
      moduleId: string;
      materialId: string;
      title: string;
      materialKind: 'video' | 'quiz' | 'other';
    };
