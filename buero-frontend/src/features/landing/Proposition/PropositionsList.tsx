import { Text } from '@/components/layout'
import { Icon } from '@/components/ui'
import { ICON_NAMES } from '@/helpers/iconNames';
import { PropositionsListProps } from '@/types/features/home/Propositions.types';
import React from 'react'

const PropositionsList: React.FC<PropositionsListProps> = ({className=""}) => {
  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      <li className="flex items-center gap-4">
        <Icon
          name={ICON_NAMES.BUBBLE}
          color="var(--color-accent-primary-hover)"
          size={16}
          className="mt-1 shrink-0"
        />
        <Text label="List proposition item 1" className="font-bold">
          Navigating German bureaucracy (Anmeldung, Visa, Taxes)
        </Text>
      </li>
      <li className="flex items-center gap-4">
        <Icon
          name={ICON_NAMES.BUBBLE}
          color="var(--color-accent-primary-hover)"
          size={16}
          className="mt-1 shrink-0"
        />
        <Text label="List proposition item 2" className="font-bold">
          Social customs and workplace etiquette
        </Text>
      </li>
      <li className="flex items-center gap-4">
        <Icon
          name={ICON_NAMES.BUBBLE}
          color="var(--color-accent-primary-hover)"
          size={16}
          className="mt-1 shrink-0"
        />
        <Text label="List proposition item 3" className="font-bold">
          Finding apartments, setting up utilities
        </Text>
      </li>
      <li className="flex items-center gap-4">
        <Icon
          name={ICON_NAMES.BUBBLE}
          color="var(--color-accent-primary-hover)"
          size={16}
          className="mt-1 shrink-0"
        />
        <Text label="List proposition item 4" className="font-bold">
          Understanding the Pfand system and recycling culture
        </Text>
      </li>
    </ul>
  );
}

export default PropositionsList;