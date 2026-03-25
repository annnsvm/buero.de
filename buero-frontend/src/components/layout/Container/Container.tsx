import { ContainerProps } from '@/types/components/layout/Container.types';

const Container = ({ children, className = '', as: Tag = 'div' }: ContainerProps) => {
  return (
    <Tag className={`mx-auto w-full max-w-[90rem] px-6 sm:px-10 md:px-16 lg:px-20 ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
