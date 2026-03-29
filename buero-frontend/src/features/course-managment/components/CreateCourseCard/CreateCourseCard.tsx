import React from 'react';
import AddNewCourse from '../AddNewCourse';

const CreateCourseCard: React.FC = () => {
  return (
    <li
      key="create-new-course-card"
      className="group flex min-h-[629px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-[var(--color-burnt-siena-lighter)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ maxWidth: '405px' }}
    >
      <AddNewCourse type="icon" />
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-center text-[1.2rem] leading-[1.5] font-[700] text-[var(--color-neutral-darkest)] sm:text-[1.3rem] lg:text-[1.625]">
          Create New Course
        </h3>
        <p className="text-center text-[1.2rem] text-[var(--color-text-primary)] sm:text-[1.3rem] lg:text-[1.425rem]">
          Click to start building a new learning path.
        </p>
      </div>
      <AddNewCourse type="button" />
    </li>
  );
};

export default CreateCourseCard;
