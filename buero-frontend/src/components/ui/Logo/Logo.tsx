import { LogoProps } from '@/types/components/ui/Logo.types';

const LOGO_LIGHT = '/images/logo_light.webp';
const LOGO_DARK= '/images/logo_dark.webp';

const Logo = ({
  width = 70,
  height = 28,
  alt = 'buero.de',
  className = '',
  isLight = false,
  ...rest
}: LogoProps) => {
  return (
    <img
      src={isLight ? LOGO_LIGHT : LOGO_DARK}
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
