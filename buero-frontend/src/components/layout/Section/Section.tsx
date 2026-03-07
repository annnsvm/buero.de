import { SectionProps } from '@/types/components/layout/Section.types';

const Section = ({ children, className="" }: SectionProps) => {
  return <section className={className ? className : 'tablet: pb-16 pb-28'} aria-label="Section">{children}</section>;
};

export default Section;
