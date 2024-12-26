import { z } from 'zod';

export const localeSchema = z.object({
  dashboard_id: z.number().min(1, 'dashboard_id is required'),
  locale: z.string().min(1, 'locale is required'),
  copy_from_locale: z.string().min(1, 'copy from is required').optional(),
});

export const localeContentSchema = z.object({
  key: z.string({ message: 'key is required' }).min(1, 'key is required'),
  content: z
    .string({ message: 'content is required' })
    .min(1, 'content is required'),
});
