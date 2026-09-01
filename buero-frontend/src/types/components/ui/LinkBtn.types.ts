import { ReactNode } from "react";

type Variant = "primary" | "outline" | "transparent" | "dark";

type LinkBtnPops = {
    to?: string;
    children: ReactNode;
    className?: string;
    variant?: Variant;
    onMouseEnter?: () => void;
}


export type { LinkBtnPops, Variant };