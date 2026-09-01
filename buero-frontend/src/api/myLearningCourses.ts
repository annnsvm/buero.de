import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { CoursesCatalogFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import type {
  CatalogCourse,
} from '@/types/api/myLearningCourses.types';

export type { CatalogCourse } from '@/types/api/myLearningCourses.types';

const readAvgVideoLessonMinutes = (course: CatalogCourse): number | null => {
  const raw = course.avgVideoLessonMinutes ?? course.avg_video_lesson_minutes;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.round(raw);
  }
  const durationRaw = course.durationHours ?? course.duration_hours;
  const durationHours = typeof durationRaw === 'number' ? durationRaw : Number(durationRaw ?? 0);
  const videoCount =
    typeof course.videoLessonCount === 'number'
      ? course.videoLessonCount
      : typeof course.video_lesson_count === 'number'
        ? course.video_lesson_count
        : 0;
  if (Number.isFinite(durationHours) && durationHours > 0 && videoCount > 0) {
    return Math.max(1, Math.round((durationHours * 60) / videoCount));
  }
  return null;
};

const readIsPublished = (course: CatalogCourse): boolean | undefined => {
  const raw = course as Record<string, unknown>;
  if (typeof raw.isPublished === 'boolean') return raw.isPublished;
  if (typeof raw.is_published === 'boolean') return raw.is_published;
  return undefined;
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
    lessonsCount:
      typeof course.lessonsCount === 'number'
        ? course.lessonsCount
        : typeof course.videoLessonCount === 'number'
          ? course.videoLessonCount
          : 0,
    durationHours: Number.isFinite(durationHours) && durationHours > 0 ? durationHours : 1,
    avgVideoLessonMinutes: readAvgVideoLessonMinutes(course),
    tags,
    hasTrial:
      !!course.my_access &&
      typeof course.my_access === 'object' &&
      'access_type' in course.my_access &&
      (course.my_access as { access_type?: string }).access_type === 'trial',
    variant: 'my-learning',
  };
};

export const mapApiCourseToCourseCard = (course: CatalogCourse): CourseCardProps => {
  const categoryRaw = String(course.category ?? course.language ?? 'language');
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

  const myAccess = course.my_access;
  const isAdded =
    myAccess != null &&
    typeof myAccess === 'object' &&
    'access_type' in (myAccess as object);

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
    lessonsCount:
      typeof course.lessonsCount === 'number'
        ? course.lessonsCount
        : typeof course.videoLessonCount === 'number'
          ? course.videoLessonCount
          : 0,
    durationHours: Number.isFinite(durationHours) && durationHours > 0 ? durationHours : 1,
    avgVideoLessonMinutes: readAvgVideoLessonMinutes(course),
    tags,
    isPublished: readIsPublished(course),
    isAdded,
  };
};

const MY_LEARNING_TTL_MS = 20_000;
let myLearningCache: { at: number; data: CourseInfoData[] } | null = null;

export const fetchMyLearningCoursesFromCatalog = async (
  force = false,
): Promise<CourseInfoData[]> => {
  if (
    !force &&
    myLearningCache &&
    Date.now() - myLearningCache.at < MY_LEARNING_TTL_MS
  ) {
    return myLearningCache.data;
  }
  const { data } = await apiInstance.get<CatalogCourse[]>(API_ENDPOINTS.courses.my);
  const accessible = Array.isArray(data) ? data : [];
  const mapped = accessible.map((course) => mapApiCourseToCourseInfo(course));
  myLearningCache = { at: Date.now(), data: mapped };
  return mapped;
};

export const peekMyLearningCourses = (): CourseInfoData[] | null =>
  myLearningCache?.data ?? null;

export const invalidateMyLearningCourses = (): void => {
  myLearningCache = null;
};

export const prefetchMyLearningCourses = (): void => {
  void fetchMyLearningCoursesFromCatalog();
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
