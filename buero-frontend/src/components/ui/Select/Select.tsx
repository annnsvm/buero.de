import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { SelectOption, SelectProps } from './Select.types';

const DEFAULT_TRIGGER_CLASSES =
  'flex w-full items-center justify-between gap-2 rounded-[12px] border border-[var(--color-border-default)] bg-white px-4 py-2 text-left outline-none focus-visible:shadow-[var(--shadow-input-default)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-70';

const DEFAULT_LIST_CLASSES =
  'absolute left-0 z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-[12px] border border-[var(--color-border-default)] bg-white shadow-lg';

function getLabel<T extends string>(options: Array<SelectOption<T>>, value: T): string {
  return options.find((o) => o.value === value)?.label ?? '';
}

const Select = <T extends string>({
  value,
  options,
  onChange,
  disabled,
  ariaLabel,
  placeholderValue,
  triggerClassName,
  listClassName,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = getLabel(options, value);
  const isPlaceholder = placeholderValue !== undefined ? value === placeholderValue : false;

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleToggle}
        className={`${DEFAULT_TRIGGER_CLASSES} ${triggerClassName ?? ''}`}
      >
        <span
          className={
            isPlaceholder
              ? 'text-[var(--color-text-secondary)]'
              : selectedLabel
                ? 'text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)]'
          }
        >
          {selectedLabel}
        </span>
        <Icon
          name={isOpen ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
          size={18}
          ariaHidden
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={`${DEFAULT_LIST_CLASSES} ${listClassName ?? ''}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (disabled) return;
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-section)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Select;

