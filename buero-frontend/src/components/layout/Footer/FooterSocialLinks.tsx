import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';

type SocialLink = { name: string; icon: (typeof ICON_NAMES)[keyof typeof ICON_NAMES]; href: string };

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', icon: ICON_NAMES.FACEBOOK, href: 'https://facebook.com' },
  { name: 'Instagram', icon: ICON_NAMES.INSTAGRAM, href: 'https://instagram.com' },
  { name: 'X', icon: ICON_NAMES.X_TWITTER, href: 'https://x.com' },
  { name: 'LinkedIn', icon: ICON_NAMES.LINKEDIN, href: 'https://linkedin.com' },
  { name: 'YouTube', icon: ICON_NAMES.YOUTUBE, href: 'https://youtube.com' },
];

const linkClass =
  'flex items-center gap-3 text-[0.9375rem] text-[var(--color-neutral-light)] transition-colors hover:text-[var(--color-neutral-white)]';

const FooterSocialLinks: React.FC = () => (
  <ul className="flex flex-col gap-3">
    {SOCIAL_LINKS.map(({ name, icon, href }) => (
      <li key={name}>
        <Link to={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Icon name={icon} size={18} color="currentColor" />
          {name}
        </Link>
      </li>
    ))}
  </ul>
);

export default FooterSocialLinks;
