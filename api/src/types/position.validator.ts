import { z } from "zod";

// Work type enum matching the database schema
export const workTypeSchema = z.enum(["remote", "hybrid", "onsite", "freelancer"]);

// Create Position Request Schema
export const createPositionSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    category: z.string().min(1, "Category is required").max(255),
    workType: workTypeSchema.optional().default("onsite"),
    location: z.string().max(255).optional(),
    description: z.string().min(1, "Description is required"),
    createdByAdminId: z.number().int().positive()
});

// Update Position Request Schema
export const updatePositionSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    category: z.string().min(1).max(255).optional(),
    workType: workTypeSchema.optional(),
    location: z.string().max(255).optional(),
    description: z.string().min(1).optional(),
});

// Position Response Schema (for list view)
export const positionListResponseSchema = z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    workType: z.string(),
    location: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Position Response Schema (for single view)
export const positionDetailResponseSchema = z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    workType: z.string(),
    location: z.string().nullable(),
    description: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Export the inferred types
export type createPositionInput = z.infer<typeof createPositionSchema>;
export type updatePositionInput = z.infer<typeof updatePositionSchema>;
export type workType = z.infer<typeof workTypeSchema>;
export type positionListResponse = z.infer<typeof positionListResponseSchema>;
export type positionDetailResponse = z.infer<typeof positionDetailResponseSchema>;
