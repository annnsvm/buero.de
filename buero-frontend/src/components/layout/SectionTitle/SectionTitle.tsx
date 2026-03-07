import { SectionTitleProps } from '@/types/components/layout/SectionTitle.types'
import React from 'react'

const SectionTitle: React.FC<SectionTitleProps> = ({ label='title', className='', children }) => {
  return (
    <h2
      aria-label={label}
      className={`leading-[1.5] font-bold text-[color:var(--color-accent-secondary)] ${className}`}
    >
      {children}
    </h2>
  );
}

export default SectionTitle