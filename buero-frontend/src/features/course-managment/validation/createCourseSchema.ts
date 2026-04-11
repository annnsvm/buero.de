import { z } from 'zod';

const languageSchema = z.enum(['en', 'de'], {
  message: 'Language must be en or de',
});

const categorySchema = z.enum(['language', 'sociocultural'], {
  message: 'Category must be language or sociocultural',
});

const levelSchema = z.enum(['A1', 'A2', 'B1', 'B2'], {
  message: 'Level must be A1, A2, B1 or B2',
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Course name is required' })
    .max(500, { message: 'Course name must be 500 characters or less' }),

  description: z
    .string()
    .trim()
    .max(5000, { message: 'Description is too long' })
    .optional()
    .or(z.literal('')),

  language: languageSchema,

  category: categorySchema,

  price: z.string().trim(),
  durationHours: z.string().trim().optional().or(z.literal('')),

  tags: z.array(
    z.string().trim().min(1, { message: 'Tag cannot be empty' }),
  ),

  level: z.union([levelSchema, z.literal('')]),
}).superRefine((values, ctx) => {
  if (!values.price.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Price is required',
    });
    return;
  }

  const n = Number(values.price.trim());
  if (Number.isNaN(n) || n < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Price must be a non‑negative number',
    });
  }

  if (values.tags.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['tags'],
      message: 'At least one tag is required',
    });
  }

  if (values.level === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['level'],
      message: 'Level is required',
    });
  }

  if (values.durationHours && values.durationHours.trim()) {
    const duration = Number(values.durationHours.trim());
    if (!Number.isInteger(duration) || duration < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['durationHours'],
        message: 'Duration must be a non-negative integer',
      });
    }
  }
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

