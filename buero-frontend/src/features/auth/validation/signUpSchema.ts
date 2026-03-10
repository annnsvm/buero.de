import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .pipe(
      z.email({
        message: 'Enter a valid email address',
      }),
    ),

  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(9, { message: 'Password must be at least 9 characters' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/(?=.*[0-9])/, {
      message: 'Password must contain at least one digit',
    }),
});
