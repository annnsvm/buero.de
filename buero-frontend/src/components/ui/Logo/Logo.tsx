import { LogoProps } from '@/types/components/ui/Logo.types';

const LOGO_SRC = '/images/home/logo.png';

const Logo = ({
  width = 70,
  height = 28,
  alt = 'buero.de',
  className = '',
  ...rest
}: LogoProps) => {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="eager"
      decoding="async"
      {...rest}
    />
  );
};

export default Logo;
