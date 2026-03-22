import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { subscriptionApi } from '@/api/subscriptionApi';
import type { CoursesCatalogFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import type {
  CatalogCourse,
  NormalizedAccess,
  RawCourseAccess,
} from '@/types/api/myLearningCourses.types';

export type { CatalogCourse, NormalizedAccess, RawCourseAccess } from '@/types/api/myLearningCourses.types';

export const normalizeAccess = (row: RawCourseAccess): NormalizedAccess => ({
  id: row.id,
  courseId: row.course_id,
  accessType: row.access_type,
  trialEndsAt: row.trial_ends_at ? new Date(row.trial_ends_at) : null,
});

export const isAccessCurrentlyValid = (a: NormalizedAccess, now = new Date()): boolean => {
  if (a.accessType === 'trial') {
    if (!a.trialEndsAt) return false;
    return a.trialEndsAt.getTime() > now.getTime();
  }
  return true;
};

export const mapApiCourseToCourseInfo = (course: CatalogCourse): CourseInfoData => {
  const categoryRaw = String(course.category ?? 'language');
  const level = course.level != null ? String(course.level) : 'A1';
  const priceRaw = course.price;
  const priceNum =
    typeof priceRaw === 'number'
      ? priceRaw
      : priceRaw != null && typeof priceRaw === 'object' && 'toString' in priceRaw
        ? Number(String((priceRaw as { toString: () => string }).toString()))
        : Number(priceRaw ?? 0);

  const durationRaw = course.durationHours ?? course.duration_hours;
  const durationHours =
    typeof durationRaw === 'number' ? durationRaw : Number(durationRaw ?? 0);

  const tags = Array.isArray(course.tags) ? (course.tags as string[]) : [];

  return {
    id: String(course.id),
    title: String(course.title ?? ''),
    description: String(course.description ?? ''),
    category: categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1),
    levelLabel: level,
    imageUrl:
      typeof course.imageUrl === 'string'
        ? course.imageUrl
        : typeof course.image_url === 'string'
          ? course.image_url
          : '/images/courses/course-1.webp',
    price: `€${Number.isFinite(priceNum) ? priceNum.toFixed(2) : '0.00'}`,
    lessonsCount: typeof course.lessonsCount === 'number' ? course.lessonsCount : 0,
    durationHours: Number.isFinite(durationHours) && durationHours > 0 ? durationHours : 1,
    tags,
    hasTrial: false,
    variant: 'my-learning',
  };
};


const normalizeAccessRow = (row: unknown): NormalizedAccess | null => {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  const courseId = (r.course_id ?? r.courseId) as string | undefined;
  const accessType = (r.access_type ?? r.accessType) as string | undefined;
  const trialRaw = (r.trial_ends_at ?? r.trialEndsAt) as string | null | undefined;
  const id = (r.id as string) ?? '';
  if (!courseId || !accessType) return null;
  return normalizeAccess({
    id,
    course_id: courseId,
    access_type: accessType as RawCourseAccess['access_type'],
    trial_ends_at: trialRaw ?? null,
    created_at: String(r.created_at ?? r.createdAt ?? ''),
  });
};

export const fetchMyLearningCoursesFromCatalog = async (): Promise<CourseInfoData[]> => {
  const rawList = await subscriptionApi.getMyAccess();
  const list = Array.isArray(rawList) ? rawList : [];
  const normalized = list
    .map(normalizeAccessRow)
    .filter((a): a is NormalizedAccess => a != null)
    .filter((a) => isAccessCurrentlyValid(a));
  const allowedIds = new Set(normalized.map((a) => a.courseId));

  const { data } = await apiInstance.get<CatalogCourse[]>(API_ENDPOINTS.courses.list);
  const published = data.filter((c) => allowedIds.has(c.id));

  return published.map((course) => mapApiCourseToCourseInfo(course));
};

export const filterMyLearningCourses = (
  courses: CourseInfoData[],
  filters: CoursesCatalogFilters,
): CourseInfoData[] => {
  let out = courses;
  const { category, search } = filters;

  if (category === 'language') {
    out = out.filter((c) => c.category.toLowerCase().includes('language'));
  } else if (category === 'sociocultural') {
    out = out.filter(
      (c) =>
        c.category.toLowerCase().includes('socio') ||
        c.category.toLowerCase().includes('culture') ||
        c.category.toLowerCase().includes('life'),
    );
  } else if (category === 'integration') {
    out = out.filter((c) =>
      c.tags.some((t: string) => t.toLowerCase().includes('integration')),
    );
  }

  const q = search?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t: string) => t.toLowerCase().includes(q)),
    );
  }

  return out;
};
