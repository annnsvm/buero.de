import React from 'react';
import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { ICON_NAMES } from '@/helpers/iconNames';

type CallToActionButtonsProps = {
  primaryText: string;
  primaryTo: string;
  secondaryText: string;
  secondaryTo: string;
};

const CallToActionButtons: React.FC<CallToActionButtonsProps> = ({
  primaryText,
  primaryTo,
  secondaryText,
  secondaryTo,
}) => (
  <div
    className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row sm:gap-6"
    aria-label="Call to action buttons"
  >
    <LinkBtn to={primaryTo} variant="primary" className="flex items-center gap-2">
      <span>{primaryText}</span>
      <Icon name={ICON_NAMES.ARROW_RIGHT} color="var(--color-white)" size={18} className="animate-bounce-x"/>
    </LinkBtn>
    <LinkBtn to={secondaryTo} variant="outline">
      {secondaryText}
    </LinkBtn>
  </div>
);

export default CallToActionButtons;
