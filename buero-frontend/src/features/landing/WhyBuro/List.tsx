import React from 'react';
import { Icon } from '@/components/ui';
import { ListProps } from '@/types/features/home/WhyBuro.types';
import { Text } from '@/components/layout';

const List: React.FC<ListProps> = ({ iconName, title, children }) => {
  return (
    <li className="flex max-w-[260px] flex-col gap-4 text-[color:var(--color-text-primary)]">
      <Icon name={iconName} size={48} strokeWidth={3} color="[color:var(--color-icon)]" />
      <h4 className="font-[family-name:var(--font-heading)] text-[1.2rem] leading-[1.4] font-bold tracking-[-0.26px] sm:text-[1.425rem] md:text-[1.625rem]">
        {title}
      </h4>
      <Text label="List item description">{children}</Text>
    </li>
  );
};

export { List };
