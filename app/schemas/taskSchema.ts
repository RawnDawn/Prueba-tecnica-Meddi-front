import { z } from "zod";

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, "El titulo es requerido"),
    description: z.string()
        .optional(),
});