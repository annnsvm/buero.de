import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import type { CourseCardProps } from './CourseCard';

type CoursesGridProps = {
  courses: CourseCardProps[];
};

const CoursesCatalogList = ({ courses }: CoursesGridProps) => {
  return (
    <Section className="bg-white py-12">
      <Container className="md:px-20">    
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
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