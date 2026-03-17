import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import type { CourseCardProps } from './CourseCard';

type CoursesGridProps = {
  courses: CourseCardProps[];
};

const CoursesCatalogList = ({ courses }: CoursesGridProps) => {
  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-20">    
        {/* <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"> */}
        <ul className="grid justify-center justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16 grid-cols-[repeat(auto-fit,minmax(303px,1fr))]">

          {courses.map((course) => (
            <li key={course.id}> 
              <CourseCard {...course} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};

export default CoursesCatalogList;