import { ROUTES } from '@/helpers/routes';
import { LinkBtnPops } from '@/types/components/ui/LinkBtn.types';
import React from 'react'
import { Link } from 'react-router-dom';

const BASE = 'inline-flex items-center justify-center px-6 py-2.5 rounded-[100px] border transition-all';

const VARIANTS = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-foreground)]',
  outline:
    'border-[var(--opacity-white-60)] bg-transparent text-[var(--color-text-inverse)] hover:bg-[var(--opacity-neutral-darkest-15)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
} as const;


const LinkBtn: React.FC<LinkBtnPops> = ({children, to=ROUTES.HOME, variant = 'primary', className=""}) => {
  const classes = [BASE, VARIANTS[variant], className].filter(Boolean).join(' ');
  return (
    <Link to={to} className={classes}>{children}</Link>
  )
}

export default LinkBtn;
