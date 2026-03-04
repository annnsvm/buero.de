import type { ImgHTMLAttributes } from "react";

const LOGO_SRC = "/images/home/logo.png";

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Logo = ({
  width = 70,
  height = 28,
  alt = "buero.de",
  className = "",
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
