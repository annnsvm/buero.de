import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  retypePassword: z.string().optional(),
}).superRefine((data, ctx) => {
  const isChangingPassword = !!data.currentPassword || !!data.newPassword || !!data.retypePassword;

  if (isChangingPassword) {
    if (!data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter your current password',
        path: ['currentPassword'],
      });
    }

    if (!data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a new password',
        path: ['newPassword'],
      });
    } else {
      if (data.newPassword.length < 9) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 9 characters',
          path: ['newPassword'],
        });
      }
      if (!/[A-Z]/.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must contain at least one uppercase letter',
          path: ['newPassword'],
        });
      }
      if (!/[0-9]/.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must contain at least one number',
          path: ['newPassword'],
        });
      }
    }

    if (data.newPassword !== data.retypePassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New passwords do not match',
        path: ['retypePassword'],
      });
    }
  }
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
