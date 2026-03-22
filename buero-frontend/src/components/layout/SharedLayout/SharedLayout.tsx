import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const SharedLayout = () => {
  const { pathname } = useLocation();
  const hideHeader =
    pathname === ROUTES.TEACHER_COURSES_EDIT ||
    pathname === ROUTES.TEACHER_COURSES_CREATE ||
    pathname.startsWith('/courses/');
  const hideFooter = pathname.includes('/teacher/courses/');

  return (
    <div>
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default SharedLayout;
