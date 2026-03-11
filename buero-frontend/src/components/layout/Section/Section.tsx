import { SectionProps } from '@/types/components/layout/Section.types';

const Section = ({ children, className="" }: SectionProps) => {
  return <section className={className ? className : 'pb-28 sm:pb-16'} aria-label="Section">{children}</section>;
};

export default Section;
