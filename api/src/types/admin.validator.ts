import { z } from "zod";

// Admin role enum matching the database schema
export const adminRoleSchema = z.enum(["superadmin", "standard"]);

// Create Admin Request Schema
export const createAdminSchema = z.object({
    firstName: z.string().max(60, "First name must be at most 60 characters"),
    lastName: z.string().max(60, "Last name must be at most 60 characters"),
    email: z.string()
        .email("Invalid email format")
        .max(100, "Email must be at most 100 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(255, "Password must be at most 255 characters"),
    role: adminRoleSchema.optional().default("standard"),
    createdByAdminId: z.number().gte(1).optional()
});

// Update Admin Request Schema
export const updateAdminSchema = z.object({
    firstName: z.string().max(60, "First name must be at most 60 characters").optional(),
    lastName: z.string().max(60, "Last name must be at most 60 characters").optional(),
    email: z.string()
        .email("Invalid email format")
        .max(100, "Email must be at most 100 characters").optional(),
    role: adminRoleSchema.optional(),
});

export const adminResponseSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    status: z.enum(["active", "deleted"]),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdByAdminId: z.number().nullable()
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

// Export the inferred types
export type createAdminInput = z.infer<typeof createAdminSchema>;
export type updateAdminInput = z.infer<typeof updateAdminSchema>;
export type adminRole = z.infer<typeof adminRoleSchema>;
export type adminResponse = z.infer<typeof adminResponseSchema>
export type login = z.infer<typeof loginSchema>
