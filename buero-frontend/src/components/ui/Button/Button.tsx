import { VARIANT_CLASSES } from '@/components/ui/Button/variantClasses';
import { ButtonProps } from '@/types/components/ui/Button.types';

const BASE_CLASSES =
  'inline-flex items-center justify-center px-6 py-2.5 rounded-[100px] border transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

const Button = ({
  children,
  isLoading = false,
  disabled,
  className = '',
  type = 'button',
  variant = 'outline',
  styleType = 'default',
  ...rest
}: ButtonProps) => {
  const combinedClassName = [BASE_CLASSES, VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={styleType === 'mobile' ? className : combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
