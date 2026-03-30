import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input, Logo } from '@/components/ui';
import { ROUTES } from '@/helpers/routes';

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const inputClass =
  'min-w-0 w-full rounded-[12px] border border-[var(--color-neutral-lighter)] bg-transparent px-4 py-2.5 text-[0.9375rem] text-[var(--color-neutral-white)] placeholder:text-[var(--color-neutral-base)] transition-colors hover:border-[var(--color-neutral-light)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-0';
const submitBtnClass =
  'w-full shrink-0 rounded-[100px] px-5 py-2.5 sm:w-auto';

const TAGLINE =
  'Learn German. Live German. Your path to language mastery and cultural integration.';

const FooterBrand: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const { onBlur, ...emailRegister } = register('email');
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    clearErrors('email');
  };

  const onSubmit = (data: NewsletterFormValues) => {
    // TODO: integrate with newsletter API when available
    void data;
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.HOME}
        className="inline-flex w-fit transition-opacity hover:opacity-80"
        aria-label="buero.de go to home"
      >
        <Logo width={70} height={28} isLight/>
      </Link>
      <p className="text-[0.9375rem] leading-[1.5] text-[var(--color-neutral-light)] max-w-[280px]">
        {TAGLINE}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex max-w-[500px] flex-col items-start gap-6 sm:flex-row sm:gap-4">
          <div className="min-w-0 w-full flex-1">
            <Input
              id="footer-newsletter-email"
              type="email"
              placeholder="Enter your email"
              aria-label="Email for newsletter subscription"
              className={inputClass}
              error={errors.email?.message}
              {...emailRegister}
              onBlur={handleEmailBlur}
            />
          </div>
          <Button type="submit" variant="solid" className={submitBtnClass}>
            Subscribe
          </Button>
        </div>
        <p className="text-[0.75rem] leading-[1.4] text-[var(--color-neutral-base)]">
          By subscribing you agree to our{' '}
          <Link to="/privacy" className="underline hover:text-[var(--color-neutral-light)]">
            Privacy Policy
          </Link>{' '}
          and provide consent to receive updates from our company.
        </p>
      </form>
    </div>
  );
};

export default FooterBrand;
