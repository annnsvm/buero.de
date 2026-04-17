import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { ROUTES } from '@/helpers/routes';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const SCROLL_THRESHOLD = 400;

const SharedLayout = () => {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isTeacherCourseEditor =
    pathname === ROUTES.TEACHER_COURSES_CREATE ||
    pathname === ROUTES.COURSE_MANAGEMENT ||
    /^\/teacher\/courses\/[^/]+\/edit$/.test(pathname);

  const hideHeader = isTeacherCourseEditor || pathname.startsWith('/courses/');
  const hideFooter = pathname.includes('/teacher/courses/');

  return (
    <div className="flex min-h-screen flex-col">
      {!hideHeader && <Header />}
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ChevronUp size={20} className="animate-bounce" />
      </button>
    </div>
  );
};

export default SharedLayout;
