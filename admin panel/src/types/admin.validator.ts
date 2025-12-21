import { z } from 'zod';

export const createAdminSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255, 'First name must be less than 255 characters'),
  lastName: z.string().min(1, 'Last name is required').max(255, 'Last name must be less than 255 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['standard', 'superadmin'], {
    message: 'Please select a valid role',
  }),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
