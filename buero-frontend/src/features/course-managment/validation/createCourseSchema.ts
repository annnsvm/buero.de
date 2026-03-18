import { z } from 'zod';

const languageSchema = z.enum(['en', 'de'], {
  message: 'Language must be en or de',
});

const categorySchema = z.enum(['language', 'sociocultural'], {
  message: 'Category must be language or sociocultural',
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

  price: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const n = Number(value);
        return !Number.isNaN(n) && n >= 0;
      },
      { message: 'Price must be a non‑negative number' },
    ),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: 'Tag cannot be empty' }),
    )
    .optional(),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

