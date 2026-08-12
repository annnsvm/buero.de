import i18n from '@/i18n';

export const deleteCourseCopy = (moduleCount: number): string =>
  i18n.t('courses.deleteCourseDescription', { count: moduleCount });
