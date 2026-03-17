import { IconName } from '@/types/helpers/iconSpite.types';

type PurchaseCardProps = {
  redirectTo: string;
  iconName: IconName;
  title: string;
  description: string;
  buttonLabel: string;
  type: 'confirmed' | 'cancel';
};

export type { PurchaseCardProps };
