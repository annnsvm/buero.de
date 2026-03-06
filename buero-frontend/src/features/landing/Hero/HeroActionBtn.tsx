import LinkBtn from '@/components/ui/Link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const HeroActionBtn: React.FC = () => {
  return (
    <ul className="flex flex-wrap gap-5 flex-col items-center sm:gap-4 sm:flex-row md:items-start" aria-label="Hero Links">
      <li>
        <LinkBtn to={'/'} variant="primary" className="flex items-center gap-3">
          <span>Get started</span>
          <ArrowRight
            color="var(--color-white)"
            className='animate-[bounce-x_1.5s_ease-in-out_infinite]' 
          />
        </LinkBtn>
      </li>
      <li>
        <LinkBtn to={'/'} variant="outline">
          Explore courses
        </LinkBtn>
      </li>
    </ul>
  );
};

export default HeroActionBtn;
