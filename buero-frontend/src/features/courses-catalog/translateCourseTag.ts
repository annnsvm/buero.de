import type { TFunction } from 'i18next';

const TAG_KEYS = new Set([
  'language',
  'integration',
  'sociocultural',
  'beginner',
  'middle',
  'advanced',
]);

export const translateCourseTag = (t: TFunction, tag: string): string => {
  const normalized = tag.trim().toLowerCase();
  if (TAG_KEYS.has(normalized)) {
    return t(`courses.tags.${normalized}`);
  }
  return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
};
