import { Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const SharedLayout = () => {
  const { pathname } = useLocation();
  const hideHeader = pathname === ROUTES.PROFILE;

  return (
    <div>
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SharedLayout;
