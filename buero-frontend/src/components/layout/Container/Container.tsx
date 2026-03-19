import { ContainerProps } from '@/types/components/layout/Container.types';

const Container = ({ children, className = '', as: Tag = 'div' }: ContainerProps) => {
  return (
    <Tag className={`mx-auto w-full max-w-[90rem] ${className}`}>
      {children}
    </Tag>
  );
};

export default Container;
