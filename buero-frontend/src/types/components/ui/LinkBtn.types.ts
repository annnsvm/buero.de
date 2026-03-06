import { ReactNode } from "react";

type Variant = "primary" | "outline";

type LinkBtnPops = {
    to?: string;
    children: ReactNode;
    className?: string;
    variant?: Variant;
}


export type { LinkBtnPops, Variant };