import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/** Розбивка матеріалів модуля: відео-уроки, квізи, інші типи. */
export const countModuleMaterialsByKind = (materials: ModuleMaterialType[] | undefined) => {
  const list = materials ?? [];
  let videoLessons = 0;
  let quizzes = 0;
  let other = 0;
  for (const item of list) {
    if (item.type === 'video') videoLessons += 1;
    else if (item.type === 'quiz') quizzes += 1;
    else other += 1;
  }
  return { videoLessons, quizzes, other };
};
