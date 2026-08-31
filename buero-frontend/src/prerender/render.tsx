import { configureStore } from '@reduxjs/toolkit';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import SharedLayout from '@/components/layout/SharedLayout/SharedLayout';
import { ModalProvider } from '@/components/modal';
import { ROUTES } from '@/helpers/routes';
import i18n, { i18nReady } from '@/i18n';
import { DEFAULT_LOCALE } from '@/i18n/constants';
import CookiesPolicyPage from '@/pages/CookiesPolicyPage/CookiesPolicyPage';
import CoursesCatalogPage from '@/pages/CoursesCatalogPage/CoursesCatalogPage';
import HomePage from '@/pages/HomePage/HomePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage/TermsOfServicePage';
import { rootReducer } from '@/redux/rootReducer';

const store = configureStore({ reducer: rootReducer });

const PrerenderApp = ({ url }: { url: string }) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[url]}>
        <ModalProvider>
          <Routes>
            <Route element={<SharedLayout />}>
              <Route index element={<HomePage />} />
              <Route path={ROUTES.COURSES} element={<CoursesCatalogPage />} />
              <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
              <Route path={ROUTES.TERMS} element={<TermsOfServicePage />} />
              <Route path={ROUTES.COOKIES} element={<CookiesPolicyPage />} />
            </Route>
          </Routes>
        </ModalProvider>
      </MemoryRouter>
    </I18nextProvider>
  </Provider>
);

export const renderPath = async (url: string): Promise<string> => {
  await i18nReady;
  await i18n.changeLanguage(DEFAULT_LOCALE);
  return renderToString(<PrerenderApp url={url} />);
};
