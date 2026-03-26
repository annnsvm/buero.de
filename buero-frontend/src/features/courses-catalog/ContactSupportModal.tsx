import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseDialog } from '@/components/modal'; 
import { FormField, Input, Button, Spinner } from '@/components/ui';

import contactSupportSchema, { type ContactSupportFormValues } from './validation/contactSupportSchema';

type ContactSupportModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  subject?: string;
  courseId?: string;
  prefillEmail?: string;
};

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  handleOpenChange,
  subject = 'Question about course',
  prefillEmail = '',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }, 
    reset,
  } = useForm<ContactSupportFormValues>({
    resolver: zodResolver(contactSupportSchema),
    mode: 'onChange', 
    defaultValues: {
      name: '',
      email: prefillEmail,
      message: '',
      termsAccepted: false,
    },
  });

  const handleClose = () => {
    reset(); 
    handleOpenChange(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log('Sending to support:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      handleClose(); 
    } catch (error) {
      console.error('Failed to send message', error);
    }
  });

  const customDialogClass = 
    'fixed top-1/2 left-1/2 z-[1001] w-[calc(100%-2rem)] max-w-[768px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-0 focus:outline-none [&>button:hover]:text-[var(--color-primary)]';
    
  return (
    <BaseDialog 
      isOpen={isOpen} 
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      titleId="contact-dialog-title"
      descriptionId="contact-dialog-description"
      contentClassName={customDialogClass}
    >
      <div className="flex w-full flex-col px-4 py-4 sm:px-14 ">
        
        <div>
          <h2 id="contact-dialog-title" className="text-[30px] sm:text-[33px] font-semibold text-[var(--color-neutral-darkest)] leading-[1.2] tracking-[-0.01em]">
            Contact us
          </h2>
          <p id="contact-dialog-description" className="mt-4 text-lg sm:text-xl text-[var(--color-neutral-darkest)]">
            How can we help you today? Please fill out the form below.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex w-full flex-col ">
          
          <FormField name="contact-name" error={errors.name?.message}>
            <label htmlFor="contact-name" className="mb-2 block text-lg font-medium text-[var(--color-neutral-darkest)]">
              Name
            </label>
            <Input
              id="contact-name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('name')}
            />
          </FormField>

          <FormField name="contact-email" error={errors.email?.message}>
            <label htmlFor="contact-email" className="mb-2 block text-lg font-medium text-[var(--color-neutral-darkest)]">
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Your email"
              className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('email')}
            />
          </FormField>

          <FormField name="contact-message" error={errors.message?.message}>
            <label htmlFor="contact-message" className="mb-2 block text-lg font-medium text-[var(--color-neutral-darkest)]">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={4} 
              placeholder="Type your message..."
              className="w-full resize-none rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('message')}
            />
          </FormField>

          <div className="mt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms-checkbox"
                {...register('termsAccepted')}
                className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-sm text-[var(--color-text-secondary)] select-none cursor-pointer">
                I accept the <a href="#" className="underline text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">Terms</a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="mt-1 text-sm text-[var(--color-error)]">
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          <div className="mt-4 self-start">
            <button 
              type="submit" 
              disabled={!isValid || isSubmitting} 
              className="flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium text-[var(--color-dawn-pink-base)] bg-[var(--color-cod-gray-base)] border border-transparent hover:border-[var(--color-cod-gray-base)] disabled:opacity-50 hover:text-[var(--color-white)] transition-all focus:outline-none" 
>
              {isSubmitting ? <Spinner /> : 'Submit'}
           </button>
          </div>
        </form>

      </div>
    </BaseDialog>
  );
};

export default ContactSupportModal;