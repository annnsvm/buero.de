
// import { useParams } from 'react-router-dom';

import { MaterialWindow } from "@/features/course-learning";

const CoursePage = () => {
  // const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="flex min-h-screen bg-[var(--color-neutral-white)]">
      <aside className="hidden border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:block lg:w-[240px] lg:shrink-0">
        {/* Sidebar component will be added here  */}
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
