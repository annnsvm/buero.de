import type { HTMLAttributes } from "react";

const Skeleton = ({
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      {...rest}
    />
  );
};

export default Skeleton;
