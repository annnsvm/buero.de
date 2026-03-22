import { Container, Section } from '@/components/layout';
import { CourseCard } from '@/features/courses-catalog';
import type { MyCoursesListProps } from '@/types/features/my-courses-catalog/MyCoursesList.types';
import React from 'react';

const MyCoursesList: React.FC<MyCoursesListProps> = ({ courses }) => {
  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-20">
        {courses?.length > 0 ? (
          <ul
            role="list"
            className="flex flex-wrap justify-start gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16"
          >
            {courses.map((course) => (
              <li key={course.id} className="w-[min(100%,405px)] shrink-0">
                <CourseCard {...course} variant="my-learning" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-2xl font-bold">Not found courses</p>
        )}
      </Container>
    </Section>
  );
};

export default MyCoursesList;
