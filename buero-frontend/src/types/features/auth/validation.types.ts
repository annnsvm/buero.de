import z from 'zod';
import { LoginSchema } from '@/features/auth';
import { signUpSchema } from '@/features/auth/validation/signUpSchema';

type LoginFormValues = z.infer<typeof LoginSchema>;

type SignUpFormValues = z.infer<typeof signUpSchema>;

export type { LoginFormValues, SignUpFormValues };
