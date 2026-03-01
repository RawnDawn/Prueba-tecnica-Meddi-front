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

    priority: z.string({
        message: 'La Prioridad es obligatorio y debe ser "Baja", "Media" o "Alta"',
    }),

    dueDate: z
        .iso.datetime({
            error: "La fecha de vencimiento es obligatoria",
        }),
});

export const taskUpdateSchema = z.object({
    title: z
        .string()
        .min(1, "El título es requerido"),

    description: z
        .string()
        .optional(),

    priority: z.string({
        message: 'La Prioridad es obligatorio y debe ser "Baja", "Media" o "Alta"',
    }),

    status: z.string({
        message: 'El estado es obligatorio y debe ser "Pendiente" o "Terminada"',
    }),

    dueDate: z
        .iso.datetime({
            error: "La fecha de vencimiento es obligatoria",
        }),

});