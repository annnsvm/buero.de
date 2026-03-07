import { IconName } from "@/types/helpers/iconSpite.types";
import { ReactNode } from "react";

type ListProps = {
  iconName: IconName;
  title: string;
  children: ReactNode;
};

export type { ListProps };
