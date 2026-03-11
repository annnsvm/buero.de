const VARIANT_CLASSES = {
  primary:
    'border-[var(--opacity-white-60)] text-[var(--color-white)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]',
  outlineDark:
    'border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  solid:
    'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)]',
} as const;

export { VARIANT_CLASSES };
