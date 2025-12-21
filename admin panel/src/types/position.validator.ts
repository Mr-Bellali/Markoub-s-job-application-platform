import { z } from 'zod';

export const createPositionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  category: z.string().min(1, 'Category is required').max(255, 'Category must be less than 255 characters'),
  workType: z.enum(['onsite', 'remote', 'hybrid', 'freelancer'], {
    errorMap: () => ({ message: 'Please select a valid work type' }),
  }),
  location: z.string().max(255, 'Location must be less than 255 characters').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
