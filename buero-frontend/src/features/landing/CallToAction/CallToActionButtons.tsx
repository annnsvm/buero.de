import React from 'react';
import { Icon } from '@/components/ui';
import LinkBtn from '@/components/ui/Link';
import { ICON_NAMES } from '@/helpers/iconNames';

type CallToActionButtonsProps = {
  primaryText: string;
  primaryTo: string;
};

const CallToActionButtons: React.FC<CallToActionButtonsProps> = ({
  primaryText,
  primaryTo,
}) => (
  <div className="flex w-full justify-center" aria-label="Call to action buttons">
    <LinkBtn
      to={primaryTo}
      variant="primary"
      className="flex items-center justify-center gap-3 px-12 py-3"
    >
      <span>{primaryText}</span>
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

export default CallToActionButtons;
