import { SectionProps } from '@/types/components/layout/Section.types';

const Section = ({ children }: SectionProps) => {
  return <section className="tablet: py-16 py-28">{children}</section>;
};

export default Section;
