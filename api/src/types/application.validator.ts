import { z } from "zod";


// Create application Request Schema
export const createApplicationSchema = z.object({
        fullName: z.string().min(1).max(180),
        email: z.string()
        .email("Invalid email format")
        .max(100, "Email must be at most 100 characters"),
        fileB64: z.string(),
        fileName: z.string()
})

// Export the inferred types
export type createApplicationInput = z.infer<typeof createApplicationSchema>