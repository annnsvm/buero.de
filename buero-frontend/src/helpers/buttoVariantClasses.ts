const VARIANT_CLASSES = {
  outline:
    'border-[var(--opacity-white-60)] text-[var(--color-white)] hover:bg-[var(--color-primary-foreground)] hover:border-[var(--color-primary-foreground)]',
  outlineDark:
    'border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  solid:
    'border-[var(--color-primary-foreground)] bg-[var(--color-primary-foreground)] text-[var(--color-white)] hover:bg-[var(--opacity-neutral-darkest-15)] hover:border-[var(--opacity-white-60)] hover:text-[var(--color-primary-foreground)]',
} as const;

export { VARIANT_CLASSES };
