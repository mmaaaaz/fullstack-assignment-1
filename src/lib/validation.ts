import { z } from "zod";

export const studentSchema = z.object({
  studentId: z
    .string()
    .min(3, { message: "Student ID must be at least 3 characters" })
    .max(20, { message: "Student ID must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Student ID can only contain letters, numbers, and hyphens",
    }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  grade: z
    .number()
    .min(0, { message: "Grade must be at least 0" })
    .max(4.0, { message: "Grade must be at most 4.0" })
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/)
        .transform(Number)
    ),
  status: z.boolean().default(true),
  remarks: z.string().max(200, { message: "Remarks must be less than 200 characters" }).optional().nullable(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
