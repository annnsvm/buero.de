import { useCallback } from 'react';
import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import TeacherSortableCoursesGrid from './TeacherSortableCoursesGrid';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { selectCatalogActiveTrialCourseId } from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';

type CoursesGridProps = {
  courses: CourseCardProps[];
  canReorderCourses?: boolean;
};

const CoursesCatalogList = ({ courses, canReorderCourses = false }: CoursesGridProps) => {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);
  const activeTrialCourseId = useAppSelector(selectCatalogActiveTrialCourseId);

  const handleCourseDeleted = useCallback(() => {
    void dispatch(fetchCoursesCatalogThunk());
  }, [dispatch]);

  return (
    <Section className="pb-28">
      <Container className="md:px-20">
        {role === 'teacher' ? (
          <TeacherSortableCoursesGrid
            courses={courses}
            dragEnabled={canReorderCourses}
            onCourseDeleted={handleCourseDeleted}
          />
        ) : (
          <ul className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
            {courses?.length > 0 &&
              courses.map((course) => (
                <li key={course.id} className="w-[min(100%,405px)] shrink-0">
                  <CourseCard
                    {...course}
                    activeTrialCourseId={role === 'student' ? activeTrialCourseId : null}
                    variant="catalog"
                  />
                </li>
              ))}
          </ul>
        )}
      </Container>
    </Section>
  );
};

export default CoursesCatalogList;
