import React from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/helpers/routes';
import Container from '../Container/Container';
import FooterBrand from './FooterBrand';
import FooterNavSection from './FooterNavSection';
import FooterNavLinks from './FooterNavLinks';
import FooterSocialLinks from './FooterSocialLinks';
import FooterBottomBar from './FooterBottomBar';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const platformLinks = [
    { to: ROUTES.COURSES, label: t('footer.allCourses') },
    { to: ROUTES.HOME, label: t('footer.freeTrial') },
    { to: ROUTES.PROFILE, label: t('footer.myLearning') },
    { to: ROUTES.HOME, label: t('footer.pricing') },
  ] as const;

  const resourcesLinks = [
    { to: ROUTES.HOME, label: t('footer.blog') },
    { to: ROUTES.HOME, label: t('footer.community') },
    { to: ROUTES.HOME, label: t('footer.support') },
    { to: ROUTES.HOME, label: t('footer.faq') },
  ] as const;

  return (
    <footer
      className="bg-[var(--color-cod-gray-dark)] text-[var(--color-neutral-white)]"
      aria-label={t('footer.siteFooter')}
    >
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-32">
          <div className="lg:max-w-[500px]">
            <FooterBrand />
          </div>
          <div className="grid grid-cols-1 gap-24 text-center sm:grid-cols-3 sm:text-start lg:min-w-0 lg:flex-1">
            <FooterNavSection title={t('footer.platform')} ariaLabel={t('footer.platform')}>
              <FooterNavLinks links={platformLinks} />
            </FooterNavSection>
            <FooterNavSection title={t('footer.resources')} ariaLabel={t('footer.resources')}>
              <FooterNavLinks links={resourcesLinks} />
            </FooterNavSection>
            <FooterNavSection title={t('footer.followUs')} ariaLabel={t('footer.followUs')}>
              <FooterSocialLinks />
            </FooterNavSection>
          </div>
        </div>
      </Container>
      <FooterBottomBar />
    </footer>
  );
};

export default Footer;
