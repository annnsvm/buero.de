import { ContainerProps } from '@/types/components/layout/Container.types';

const Container = ({ children, className = '', as: Tag = 'div' }: ContainerProps) => {
  return (
    <Tag className={`sm:px-15 md:px-16 mx-auto w-full max-w-7xl px-5 ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
