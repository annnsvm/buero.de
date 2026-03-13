import { SpinnerProps, SpinnerVariant } from '@/types/components/ui/Spinner.types';

const SPINNER_VARIANT_CLASSES: Record<SpinnerVariant, string> = {
  onPrimary: 'border-white/40 border-t-white', // для праймері кольору
  onLight: 'border-neutral-400 border-t-neutral-800', // для білих і дуже світлих фонів
  onDark: 'border-white/30 border-t-white', // для темних і дуже темних фонів
};
const Spinner: React.FC<SpinnerProps> = ({ variant = 'onPrimary', className = '' }) => {
  const variantClasses = SPINNER_VARIANT_CLASSES[variant];
  return (
    <span
      className={`inline-block size-6 animate-spin rounded-full border-2 ${variantClasses} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
