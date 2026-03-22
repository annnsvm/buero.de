/** Вкладка основного контенту на сторінці керування курсом */
export type CourseManagementRightTab = 'course' | 'material';

/** Режим модалки додавання / редагування модуля */
export type CourseModuleModalMode = 'create' | 'edit';

/** Ціль підтвердження видалення на сторінці керування курсом */
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
