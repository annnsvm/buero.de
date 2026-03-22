import { Link } from 'react-router-dom';

import { ROUTES } from '@/helpers/routes';
import { useAppSelector } from '@/redux/hooks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';

type HeaderLearningNavProps = {
  className?: string;
};

const HeaderLearningNav = ({ className }: HeaderLearningNavProps) => {
  const role = useAppSelector(selectUserRole);

  const defaultNavClassName =
    'hidden h-[27px] w-fit items-center justify-between gap-4 text-[18px] leading-[150%] font-medium text-[var(--color-text-primary)] lg:flex';

  return (
    <nav
      aria-label="Learning navigation"
      className={className ?? defaultNavClassName}
    >
      <Link
        to={ROUTES.ASSESSMENT}
        className="transition-colors hover:text-[var(--color-primary)]"
      >
        Vocabulary
      </Link>
      <Link to={ROUTES.COURSES} className="transition-colors hover:text-[var(--color-primary)]">
        All Courses
      </Link>
      {role === 'teacher' ? (
        <Link
          to={ROUTES.COURSE_MANAGEMENT}
          className="transition-colors hover:text-[var(--color-primary)] hover:opacity-80"
        >
          Add Course
        </Link>
      ) : role === 'student' ? (
        <Link
          to={ROUTES.MY_LEARNING}
          className="transition-colors hover:text-[var(--color-primary)] hover:opacity-80"
        >
          My Learning
        </Link>
      ) : null}
    </nav>
  );
};

export default HeaderLearningNav;

