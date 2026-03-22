import React from 'react';
import { Input, Select } from '@/components/ui';
import { CURRENCY_OPTIONS } from '@/features/course-managment/helpers/courseCreation.consts';
import type { CoursePriceSectionProps } from '@/types/features/courseManagment/CoursePriceSection.types';

const CoursePriceSection: React.FC<CoursePriceSectionProps> = ({
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

        <div className="mt-4 flex items-stretch overflow-visible">
          <Select
            ariaLabel="Currency"
            value={currencySymbol}
            options={CURRENCY_OPTIONS}
            onChange={onChangeCurrencySymbol}
            disabled={disabled}
            triggerClassName="h-full w-[84px] border-r-0 rounded-r-none px-3"
            listClassName="w-[84px]"
          />
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
              className="rounded-l-none border-l-0 focus-visible:shadow-none"
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
