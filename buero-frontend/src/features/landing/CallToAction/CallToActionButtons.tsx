import React from 'react';
import { useTranslation } from 'react-i18next';
import LandingCta from '../shared/LandingCta';

type CallToActionButtonsProps = {
  primaryText: string;
  primaryTo: string;
};

const CallToActionButtons: React.FC<CallToActionButtonsProps> = ({
  primaryText,
  primaryTo,
}) => (
  <div className="flex w-full justify-center" aria-label="Call to action buttons">
    <LandingCta label={primaryText} to={primaryTo} />
  </div>
);

export default CallToActionButtons;
