import { IconName } from "@/types/helpers/iconSpite.types";

type IconProps = {
  name: IconName;
  width?: number;
  height?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
};

export type { IconProps };