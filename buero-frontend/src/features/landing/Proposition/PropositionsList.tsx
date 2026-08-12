import { Text } from '@/components/layout'
import { Icon } from '@/components/ui'
import { ICON_NAMES } from '@/helpers/iconNames';
import { LinkBtnPops } from '@/types/components/ui/LinkBtn.types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const PropositionsList: React.FC<LinkBtnPops> = ({ className = '' }) => {
  const { t } = useTranslation();

  const items = [
    t('landing.propositionItem1'),
    t('landing.propositionItem2'),
    t('landing.propositionItem3'),
    t('landing.propositionItem4'),
  ];

  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-4">
          <Icon
            name={ICON_NAMES.BUBBLE}
            color="var(--color-accent-primary-hover)"
            size={16}
            className="mt-1 shrink-0"
          />
          <Text label={`List proposition item ${index + 1}`} className="font-bold">
            {item}
          </Text>
        </li>
      ))}
    </ul>
  );
};

export default PropositionsList;
