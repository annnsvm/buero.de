import { SectionProps } from '@/types/components/layout/Section.types';

const Section = ({ children, className="" }: SectionProps) => {
  return <section className={className ? className : 'tablet: py-16 py-28'} aria-label="Section">{children}</section>;
};

export default Section;
