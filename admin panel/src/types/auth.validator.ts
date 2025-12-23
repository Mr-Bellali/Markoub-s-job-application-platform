import { z } from 'zod';

export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdByAdminId: number | null;
  createdAt: string;
  updatedAt: string;
  hashedPassword: string | null;
}

export interface LoginResponse {
  token: string;
  account: Account;
}

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
