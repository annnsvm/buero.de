import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { BaseDialog, ModalScrollArea } from '@/components/modal';
import { FormField, Input, Spinner } from '@/components/ui';

import contactSupportSchema, { type ContactSupportFormValues } from './validation/contactSupportSchema';

const BOOK_SESSION_SUBJECT_EN = 'Book 1-on-1 Session';

type ContactSupportModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onExitAnimationComplete?: () => void;
  subject?: string;
  courseId?: string;
  prefillEmail?: string;
};

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  handleOpenChange,
  onExitAnimationComplete,
  subject,
  prefillEmail = '',
}) => {
  const { t } = useTranslation();
  const resolvedSubject = subject ?? t('courses.modal.supportSubject');
  const isBookSession =
    resolvedSubject === BOOK_SESSION_SUBJECT_EN ||
    resolvedSubject === t('courses.contact.bookSessionSubject');

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
    'relative z-[1] flex max-h-[min(90vh,720px)] w-[calc(100%-2rem)] max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white px-6 pt-6 pb-6 focus:outline-none sm:px-8 sm:pb-8 [&>button:hover]:text-[var(--color-primary)]';

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
      titleId="contact-dialog-title"
      descriptionId="contact-dialog-description"
      contentClassName={customDialogClass}
    >
      <ModalScrollArea contentGutter>
      <div className="flex flex-col">
        <h2 id="contact-dialog-title" className="text-2xl font-semibold text-[var(--color-neutral-darkest)]">
          {t('courses.contact.title')}
        </h2>
        <p id="contact-dialog-description" className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {isBookSession
            ? t('courses.contact.bookSessionDescription')
            : t('courses.contact.defaultDescription')}
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <FormField name="contact-name" error={errors.name?.message}>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]">
              {t('courses.contact.name')}
            </label>
            <Input
              id="contact-name"
              type="text"
              placeholder={t('courses.contact.namePlaceholder')}
              className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('name')}
            />
          </FormField>

          <FormField name="contact-email" error={errors.email?.message}>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]">
              {t('courses.contact.email')}
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder={t('courses.contact.emailPlaceholder')}
              className="w-full rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('email')}
            />
          </FormField>

          <FormField name="contact-message" error={errors.message?.message}>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--color-neutral-darkest)]">
              {t('courses.contact.message')}
            </label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder={t('courses.contact.messagePlaceholder')}
              className="w-full resize-none rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--opacity-neutral-darkest-5)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)] focus:border-[var(--color-neutral-darkest)]/40 focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
              {...register('message')}
            />
          </FormField>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms-checkbox"
                {...register('termsAccepted')}
                className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-sm text-[var(--color-text-secondary)] select-none cursor-pointer">
                {t('courses.contact.termsPrefix')}{' '}
                <a href="#" className="underline text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                  {t('courses.contact.terms')}
                </a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="mt-1 text-sm text-[var(--color-error)]">
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-2 w-full rounded-full bg-[var(--color-cod-gray-base)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Spinner /> : t('courses.contact.submit')}
          </button>
        </form>
      </div>
      </ModalScrollArea>
    </BaseDialog>
  );
};

export default ContactSupportModal;
