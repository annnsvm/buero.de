import type { IconName } from '@/types/helpers/iconSpite.types';
import type { ReactNode } from 'react';

export type BenefitCardProps = {
  iconName: IconName;
  title: string;
  children: ReactNode;
};

export type ProgressPreviewProps = {
  /** Replace the CSS mockup with a real screenshot when ready. */
  screenshotSrc?: string;
};
