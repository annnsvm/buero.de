import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';

type SocialLink = {
  name: string;
  icon: (typeof ICON_NAMES)[keyof typeof ICON_NAMES];
  href?: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Instagram',
    icon: ICON_NAMES.INSTAGRAM,
    href: 'https://www.instagram.com/buro.de.german/',
  },
  { name: 'LinkedIn', icon: ICON_NAMES.LINKEDIN },
  { name: 'TikTok', icon: ICON_NAMES.TIKTOK },
];

const baseClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--opacity-neutral-darkest-15)] transition-colors';

const activeClass =
  `${baseClass} text-[var(--color-neutral-light)] hover:border-[var(--color-burnt-siena-base)] hover:bg-[var(--color-burnt-siena-base)] hover:text-white`;

const mutedClass =
  `${baseClass} cursor-default text-[var(--color-neutral-base)] opacity-70`;

const FooterSocialLinks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ul className="flex items-center justify-center gap-3" aria-label={t('footer.followUs')}>
      {SOCIAL_LINKS.map(({ name, icon, href }) => (
        <li key={name}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={activeClass}
              aria-label={name}
            >
              <Icon name={icon} size={18} color="currentColor" />
            </a>
          ) : (
            <span className={mutedClass} title={t('footer.socialComingSoon')} aria-label={`${name} — ${t('footer.socialComingSoon')}`}>
              <Icon name={icon} size={18} color="currentColor" />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FooterSocialLinks;
