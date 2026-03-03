import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = ({ children}: CardProps) => {
  return (
    <div
    >
      {children}
    </div>
  );
};

export default Card;
