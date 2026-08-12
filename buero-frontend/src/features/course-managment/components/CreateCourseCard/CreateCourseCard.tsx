import React from 'react';
import { useTranslation } from 'react-i18next';
import AddNewCourse from '../AddNewCourse';

const CreateCourseCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <li
      key="create-new-course-card"
      className="w-[min(100%,405px)] shrink-0 group flex min-h-[629px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-[var(--color-burnt-siena-lighter)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <AddNewCourse type="icon" />
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-center text-[1.2rem] leading-[1.5] font-[700] text-[var(--color-neutral-darkest)] sm:text-[1.3rem] lg:text-[1.625]">
          {t('courses.createNewCourse')}
        </h3>
        <p className="text-center text-[1.2rem] text-[var(--color-text-primary)] sm:text-[1.3rem] lg:text-[1.425rem]">
          {t('courses.createNewCourseHint')}
        </p>
      </div>
      <AddNewCourse type="button" />
    </li>
  );
};

export default CreateCourseCard;
