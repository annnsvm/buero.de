import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
};

const Section = ({
  children,
}: SectionProps) => {
  return (
    <section className="py-16 tablet: py-28">
        {children}
    </section>
  );
};

export default Section;
