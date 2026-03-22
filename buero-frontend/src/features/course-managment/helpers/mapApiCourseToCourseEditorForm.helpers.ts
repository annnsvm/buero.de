import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type ApiCourseTreeResponse = {
  title?: string;
  description?: string | null;
  language?: string;
  category?: string;
  price?: number | null;
  durationHours?: number | null;
  duration_hours?: number | null;
  tags?: string[];
  level?: string | null;
  isPublished?: boolean;
  is_published?: boolean;
  modules?: Modules[];
};

const isLanguage = (v: string): v is CreateCourseFormValues['language'] =>
  v === 'en' || v === 'de';

const isCategory = (v: string): v is CreateCourseFormValues['category'] =>
  v === 'language' || v === 'sociocultural';

const isLevel = (v: string): v is Exclude<CreateCourseFormValues['level'], ''> =>
  v === 'A1' || v === 'A2' || v === 'B1' || v === 'B2';

/**
 * Мапінг відповіді GET /courses/:id (дерево курсу) у значення форми редактора.
 */
export const mapApiCourseToCourseEditorFormValues = (
  data: ApiCourseTreeResponse,
): CreateCourseFormValues => {
  const langRaw = String(data.language ?? 'en');
  const catRaw = String(data.category ?? 'language');
  const levelRaw = data.level != null ? String(data.level) : '';

  const durationRaw = data.durationHours ?? data.duration_hours;
  const priceNum = data.price;

  return {
    title: String(data.title ?? ''),
    description: data.description != null ? String(data.description) : '',
    language: isLanguage(langRaw) ? langRaw : 'en',
    category: isCategory(catRaw) ? catRaw : 'language',
    price:
      priceNum != null && Number.isFinite(Number(priceNum))
        ? String(priceNum)
        : '',
    durationHours:
      durationRaw != null && Number.isFinite(Number(durationRaw))
        ? String(durationRaw)
        : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    level: isLevel(levelRaw) ? levelRaw : '',
  };
};

export const getCoursePublishedFromApi = (data: ApiCourseTreeResponse): boolean =>
  data.isPublished === true || data.is_published === true;
