import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from '../Container/Container';
import FooterBrand from './FooterBrand';
import FooterSocialLinks from './FooterSocialLinks';
import FooterBottomBar from './FooterBottomBar';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      className="bg-[var(--color-cod-gray-dark)] text-[var(--color-neutral-white)]"
      aria-label={t('footer.siteFooter')}
    >
      <Container className="flex flex-col items-center gap-8 py-10 text-center sm:py-12">
        <FooterBrand />
        <div className="flex flex-col items-center gap-3">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-[var(--color-neutral-base)] uppercase">
            {t('footer.followUs')}
          </p>
          <FooterSocialLinks />
        </div>
      </Container>
      <FooterBottomBar />
    </footer>
  );
};

export default Footer;
