import { z } from "zod";
import { TaskPriority } from "~/types/task";

const priorityEnum = z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]);

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, "El título es requerido"),

    description: z
        .string()
        .optional(),

    priority: priorityEnum.refine((val) => [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].includes(val), {
        message: 'La Prioridad es obligatorio y debe ser "Baja", "Media" o "Alta"',
    }),

});