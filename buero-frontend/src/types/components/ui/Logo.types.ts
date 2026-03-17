import type { ImgHTMLAttributes } from 'react';

interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
  isLight?: boolean;
}

export type { LogoProps };
