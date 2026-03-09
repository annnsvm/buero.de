import { ContainerProps } from '@/types/components/layout/Container.types';

const Container = ({ children, className = '', as: Tag = 'div' }: ContainerProps) => {
  return (
    <Tag className={`mx-auto w-full max-w-360 px-5 sm:px-15 lg:px-20 ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
