import { z } from "zod"

export const applicationSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),

    email: z.string().email("Invalid email address").max(100),

    resume: z.instanceof(File, { message: "Resume is required" })
        .refine((file) => file.type === "application/pdf", {
            message: "Only PDF files are allowed",
        })
        .refine((file) => file.size <= 2 * 1024 * 1024, {
            message: "File must be smaller than 2MB",
        }),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
