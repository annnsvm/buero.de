import React from 'react'
import { TextProps } from '@/types/components/layout/Text.types'

const defaultClassName = 'text-[color:var(--color-border-strong] leading-[1.5] text-[1.25rem]';

const Text: React.FC<TextProps> = ({label, className="", children}) => {
  return (
    <p className={`${defaultClassName} ${className}`} aria-label={label}>
      {children}
    </p>
  )
}

export default Text