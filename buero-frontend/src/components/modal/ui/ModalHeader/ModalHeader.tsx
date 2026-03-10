import * as Dialog from '@radix-ui/react-dialog';
import { Text, Title } from '@/components/layout';
import { ModalHeaderProps } from '@/types/components/modal/ui/ModalHeader.types';

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, description, className="" }) => {
  return (
    <header className={`flex flex-col gap-6 text-center ${className}`}>
      <Dialog.Title asChild>
        <Title>{title}</Title>
      </Dialog.Title>

      {description && (
        <Dialog.Description asChild>
          <Text label={description}>{description}</Text>
        </Dialog.Description>
      )}
    </header>
  );
};

export default ModalHeader;
