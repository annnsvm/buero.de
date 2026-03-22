export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export type SelectProps<T extends string> = {
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
  placeholderValue?: T;
  triggerClassName?: string;
  listClassName?: string;
};

