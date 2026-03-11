import { PropositionImgProps } from '@/types/features/home/Propositions.types'
import React from 'react'

const PropositionImg: React.FC<PropositionImgProps> = ({className}) => {
  return (
    <div
      className={`min-w-0 h-full w-full lg:w-[600px] overflow-hidden rounded-lg aspect-[4/3] lg:aspect-auto lg:self-stretch ${className}`}
    >
      <img
        src="/images/home/learn.webp"
        alt="Proposition"
        className="h-full w-full object-cover object-left"
      />
    </div>
  )
}

export default PropositionImg