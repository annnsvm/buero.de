import { TitleProps } from '@/types/components/layout/Title.types'
import React from 'react'

const titleStyle =
  'font-[family-name:var(--font-heading)] text-[1.75rem] sm:text-[2rem] md:text-[3.75rem] font-bold leading-[1.2] tracking-[-0.6px]';

const Title: React.FC<TitleProps> = ({isHome, className="", children}) => {
  return (
    isHome ? <h3 className={`${titleStyle} ${className}`}>{children}</h3> : <h2 className={`${titleStyle} ${className}`}>{children}</h2>
  )
}

export default Title