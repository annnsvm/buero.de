import React from 'react';
import Button from '../../ui/Button';
import { HeaderNavAuthTrialProps } from '@/types/components/layout/Header.types';

const HeaderAuthTrialBar: React.FC<HeaderNavAuthTrialProps> = ({
  isLight,
  from = '',
  className = '',
}) => {
  return (
    <div className={['flex gap-2', className].join(' ')}>
      <Button
        variant={isLight ? 'outline' : 'outlineDark'}
        aria-label="Sign in"
        className={from ? 'w-full' : ''}
      >
        Sign in
      </Button>
      <Button variant="solid" aria-label="Start free trial" className={from ? 'w-full' : ''}>
        Start free trial
      </Button>
    </div>
  );
};

export default HeaderAuthTrialBar;
