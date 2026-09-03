import { Icon } from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import LinkBtn from '@/components/ui/Link';
import { ROUTES } from '@/helpers/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroActionBtn: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-center">
      <LinkBtn
        to={ROUTES.COURSES}
        variant="primary"
        className="flex items-center justify-center gap-3 px-20 py-3 font-semibold"
      >
        <span>{t('landing.getStarted')}</span>
        <Icon
          name={ICON_NAMES.ARROW_RIGHT}
          color="var(--color-white)"
          size={15}
          strokeWidth={3}
          className="animate-bounce-x"
        />
      </LinkBtn>
    </div>
  );
};

export default HeroActionBtn;
