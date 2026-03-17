import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';


type UiModalType =
  | 'courseInfo'
  | 'contactSupport'
  | 'addVocabulary'
  | 'addVocabularySuccess'
  | 'confirm';
// Додав
  export type CourseModule = {
  id: string;
  title: string;
  lessonsCount: number;
  lessons: { id: string; title: string; duration: string }[];
};

export type CourseInfoData = CourseCardProps & {
  modules?: CourseModule[];
  addOns?: { id: string; title: string; description: string; price: string }[];
};
// 

type UiModalPayload =
  | {
      type: 'courseInfo';
      courseId: string;
      course?: CourseInfoData;
    }
  | {
      type: 'contactSupport';
      subject?: string;
      courseId?: string;
      prefillEmail?: string;
    }
  | {
      type: 'addVocabulary';
      initialWord?: string;
      initialTranslation?: string;
      categoryId?: string;
    }
  | {
      type: 'addVocabularySuccess';
      word: string;
      translation?: string;
    }
  | {
      type: 'confirm';
      title: string;
      message?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    };

type UIModalStackItem = UiModalPayload;
type UIModalStack = UIModalStackItem[];

export type { UiModalType, UiModalPayload, UIModalStackItem, UIModalStack };
