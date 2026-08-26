import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { InputProps } from '@/types/components/ui/Input.types';
import Icon from '../Icon';
import Input from '../Input';

type PasswordInputProps = Omit<InputProps, 'type'>;

const PasswordInput: React.FC<PasswordInputProps> = ({ className = '', id, ...rest }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        className={`pr-12 ${className}`}
        {...rest}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        aria-controls={id}
        aria-pressed={visible}
      >
        <Icon
          name={visible ? ICON_NAMES.EYE_PSW_HIDE : ICON_NAMES.EYE_PSW_SHOW}
          size={20}
        />
      </button>
    </div>
  );
};

export default PasswordInput;
