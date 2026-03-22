import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';

export type CoursePriceSectionProps = {
  amount: string;
  currencySymbol: CurrencySymbol;
  error?: string;
  disabled?: boolean;
  onChangeAmount: (value: string) => void;
  onChangeCurrencySymbol: (value: CurrencySymbol) => void;
};
