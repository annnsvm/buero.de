import React, { useState } from 'react';
import { BaseDialog } from '@/components/modal';
import { ModalBody } from '@/components/modal';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail);
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleClose = () => handleOpenChange(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the Terms to submit the form.");
      return;
    }
    console.log({ name, email, message, termsAccepted });
    handleClose();
  };

  return (
    <BaseDialog isOpen={isOpen} handleOpenChange={handleOpenChange}>
      <ModalBody>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Contact us
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Placeholder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-[var(--color-neutral-lighter)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="Placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-[var(--color-neutral-lighter)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-[var(--color-neutral-lighter)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-card)] focus:outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-[var(--color-text-secondary)] select-none"
            >
              I accept the <a href="#" className="underline text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">Terms</a>
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--color-black)] px-8 py-2.5 text-sm font-semibold text-[var(--color-text-on-accent)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!termsAccepted}
            >
              Submit
            </button>
          </div>
        </form>
      </ModalBody>
    </BaseDialog>
  );
};

export default ContactSupportModal;