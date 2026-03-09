import { Icon } from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import LinkBtn from '@/components/ui/Link';
import React from 'react';

const HeroActionBtn: React.FC = () => {
  return (
    <ul
      className="flex flex-col flex-wrap items-center gap-5 sm:flex-row sm:gap-4 lg:items-start"
      aria-label="Hero Links"
    >
      <li>
        <LinkBtn to={'/'} variant="primary" className="flex items-center gap-3">
          <span>Get started</span>
          <Icon
            name={ICON_NAMES.ARROW_RIGHT}
            color="var(--color-white)"
            size={15}
            strokeWidth={3}
            className="animate-bounce-x"
          />
        </LinkBtn>
      </li>
      <li>
        <LinkBtn to={'/'} variant="outline">
          Explore courses
        </LinkBtn>
      </li>
    </ul>
  );
};

export default HeroActionBtn;
