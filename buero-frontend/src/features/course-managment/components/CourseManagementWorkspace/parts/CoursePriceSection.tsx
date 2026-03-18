import React from 'react';
import { Input } from '@/components/ui';

export type CurrencySymbol = '€' | '$' | '£';

const CURRENCY_SYMBOLS: readonly CurrencySymbol[] = ['€', '$', '£'] as const;

type Props = {
  amount: string;
  currencySymbol: CurrencySymbol;
  error?: string;
  disabled?: boolean;
  onChangeAmount: (value: string) => void;
  onChangeCurrencySymbol: (value: CurrencySymbol) => void;
};

const CoursePriceSection: React.FC<Props> = ({
  amount,
  currencySymbol,
  error,
  disabled,
  onChangeAmount,
  onChangeCurrencySymbol,
}) => {
  return (
    <section
      className="rounded-2xl bg-[var(--color-surface-background)] p-6"
      aria-label="Course price"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Course price</p>

        <div className="mt-4 flex items-stretch overflow-hidden">
          <select
            aria-label="Currency"
            className="w-[72px] shrink-0 bg-white px-3 outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-70"
            value={currencySymbol}
            onChange={(e) => onChangeCurrencySymbol(e.target.value as CurrencySymbol)}
            disabled={disabled}
          >
            {CURRENCY_SYMBOLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="w-[100px] flex-1">
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="69.00"
              value={amount}
              onChange={(e) => onChangeAmount(e.target.value)}
              aria-label="Price amount"
              disabled={disabled}
              className="rounded-none border-0 focus-visible:shadow-none"
            />
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default CoursePriceSection;
