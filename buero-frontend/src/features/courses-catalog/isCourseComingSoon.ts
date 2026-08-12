export const isCourseComingSoon = (course: {
  isPublished?: boolean;
  lessonsCount: number;
}): boolean => course.lessonsCount < 1 && course.isPublished !== false;
