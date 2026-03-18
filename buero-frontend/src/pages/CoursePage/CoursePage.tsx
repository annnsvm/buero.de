
// import { useParams } from 'react-router-dom';

import { MaterialWindow } from "@/features/course-learning";
import { CourseStructure } from "@/features/courses-catalog";

const MOCK_MODULES = [
  {
    id: '1',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [
      { id: '1', title: 'Welcome to German A1', duration: '5:30' },
      { id: '2', title: 'The German Alphabet & Pronunciation', duration: '12:15' },
      { id: '3', title: 'Pronunciation Practice', duration: '8:00' },
      { id: '4', title: 'Your First German Words', duration: '10:45' },
    ],
  },
  {
    id: '2',
    title: 'Greetings & Introductions',
    lessonsCount: 4,
    lessons: [
      { id: '5', title: 'Saying Hello and Goodbye', duration: '6:20' },
      { id: '6', title: 'Introducing Yourself', duration: '9:15' },
      { id: '7', title: 'Asking Names', duration: '7:40' },
      { id: '8', title: 'Formal vs Informal', duration: '11:00' },
    ],
  },
  {
    id: '3',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [],
  },
  {
    id: '4',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [],
  },
];


const CoursePage = () => {
  // const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="flex min-h-screen bg-[var(--color-neutral-white)] pt-16">
      <aside className="hidden border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:block lg:w-[240px] lg:shrink-0">
        {/* Sidebar component will be added here  */}
        <CourseStructure modules={MOCK_MODULES}/>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)]">
          {/* Header component will be added here  */}
        </header>

        <main className="min-w-0 flex-1 bg-[var(--color-soapstone-base)]">
          <MaterialWindow />
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
