import { Container, Section } from '@/components/layout';
import CourseCard from './CourseCard';
import type { CourseCardProps } from './CourseCard';
import { useAppSelector } from '@/redux/hooks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { CreateCourseCard } from '../course-managment';

type CoursesGridProps = {
  courses: CourseCardProps[];
};

const CoursesCatalogList = ({ courses }: CoursesGridProps) => {
  const role = useAppSelector(selectUserRole);
  return (
    <Section className="bg-white pb-28">
      <Container className="md:px-20">    
        <ul className="grid justify-center justify-items-center gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-16 grid-cols-[repeat(auto-fit,minmax(303px,1fr))]">
          {
            role === "teacher" && <CreateCourseCard />
          }
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