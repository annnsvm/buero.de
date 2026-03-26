import { z } from 'zod';

const contactSupportSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name is too long' }),

  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .pipe(
      z.email({
        message: 'Enter a valid email address',
      }),
    ),

  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(2000, { message: 'Message cannot exceed 2000 characters' }),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms to continue',
    }),
});

export type ContactSupportFormValues = z.infer<typeof contactSupportSchema>;
export default contactSupportSchema;