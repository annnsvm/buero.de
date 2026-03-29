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
    className="flex w-full flex-col flex-nowrap gap-6 sm:w-fit sm:flex-row sm:items-center sm:justify-center sm:gap-4"
    aria-label="Call to action buttons"
  >
    <LinkBtn
      to={primaryTo}
      variant="primary"
      className="flex w-full items-center gap-2 sm:w-auto"
    >
      <span>{primaryText}</span>
      <Icon name={ICON_NAMES.ARROW_RIGHT} color="var(--color-white)" size={18} className="animate-bounce-x"/>
    </LinkBtn>
    <LinkBtn to={secondaryTo} variant="outline" className="w-full sm:w-auto">
      {secondaryText}
    </LinkBtn>
  </div>
);

export default CallToActionButtons;
