import React from 'react';
import { ROUTES } from '@/helpers/routes';
import Container from '../Container/Container';
import FooterBrand from './FooterBrand';
import FooterNavSection from './FooterNavSection';
import FooterNavLinks from './FooterNavLinks';
import FooterSocialLinks from './FooterSocialLinks';
import FooterBottomBar from './FooterBottomBar';

const PLATFORM_LINKS = [
  { to: ROUTES.COURSES, label: 'All courses' },
  { to: ROUTES.HOME, label: 'Free Trial' },
  { to: ROUTES.PROFILE, label: 'My Learning' },
  { to: ROUTES.HOME, label: 'Pricing' },
] as const;

const RESOURCES_LINKS = [
  { to: ROUTES.HOME, label: 'Blog' },
  { to: ROUTES.HOME, label: 'Community' },
  { to: ROUTES.HOME, label: 'Support' },
  { to: ROUTES.HOME, label: 'FAQ' },
] as const;

const Footer: React.FC = () => (
  <footer
    className="bg-[var(--color-cod-gray-dark)] text-[var(--color-neutral-white)]"
    aria-label="Site footer"
  >
    <Container className="py-16 lg:py-20">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-32">
        <div className="lg:max-w-[500px]">
          <FooterBrand />
        </div>
        <div className="grid grid-cols-1 gap-24 sm:grid-cols-3 lg:min-w-0 lg:flex-1">
          <FooterNavSection title="Platform" ariaLabel="Platform navigation">
            <FooterNavLinks links={PLATFORM_LINKS} />
          </FooterNavSection>
          <FooterNavSection title="Resources" ariaLabel="Resources navigation">
            <FooterNavLinks links={RESOURCES_LINKS} />
          </FooterNavSection>
          <FooterNavSection title="Follow Us" ariaLabel="Social media links">
            <FooterSocialLinks />
          </FooterNavSection>
        </div>
      </div>
    </Container>
    <FooterBottomBar />
  </footer>
);

export default Footer;
