import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
};

const Container = ({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) => {
  return (
    <Tag
      className={`mx-auto w-full max-w-7xl px-5 mobile:px-15 tablet:px-20 ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Container;
