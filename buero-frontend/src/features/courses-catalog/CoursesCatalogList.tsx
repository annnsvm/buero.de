import { useCallback } from 'react';
import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { CreateCourseCard } from '../course-managment';

type CoursesGridProps = {
  courses: CourseCardProps[];
};

const CoursesCatalogList = ({ courses }: CoursesGridProps) => {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);

  const handleCourseDeleted = useCallback(() => {
    void dispatch(fetchCoursesCatalogThunk());
  }, [dispatch]);

  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-20">
        <ul className="flex flex-wrap justify-start gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16">
          {role === 'teacher' && <CreateCourseCard />}
          {courses.map((course) => (
            <li key={course.id} className="w-[min(100%,405px)] shrink-0">
              <CourseCard
                {...course}
                variant={role === 'teacher' ? 'teacher-catalog' : 'catalog'}
                onCourseDeleted={role === 'teacher' ? handleCourseDeleted : undefined}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};

export default CoursesCatalogList;