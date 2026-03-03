import type { ReactNode } from "react";
import Container from "../Container/Container";

type SectionProps = {
  children: ReactNode;
};

const Section = ({
  children,
}: SectionProps) => {
  return (
    <section>
      <Container >
        {children}
      </Container>
    </section>
  );
};

export default Section;
