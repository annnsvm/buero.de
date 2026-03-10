import z from 'zod';
import { LoginSchema } from '@/features/auth';

type LoginFormValues = z.infer<typeof LoginSchema>;

export type { LoginFormValues };
