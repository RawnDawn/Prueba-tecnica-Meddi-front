/**
 * API task errors
 */
export const TASK_ERROR_MESSAGES = {
    TASK_NOT_FOUND: "La tarea no fue encontrada.",
    DUE_DATE_REQUIRED: "La fecha de vencimiento es obligatoria.",
    DUE_DATE_MUST_BE_GREATER_THAN_NOW: "La fecha de vencimiento debe ser mayor a la fecha actual.",
    TITLE_IS_REQUIRED: "El título es obligatorio.",
    DESCRIPTION_IS_REQUIRED: "La descripción es obligatoria.",
    PRIORITY_IS_REQUIRED: "La prioridad es obligatoria.",
    INVALID_PRIORITY: "La prioridad proporcionada no es válida.",
    STATUS_IS_REQUIRED: "El estado es obligatorio.",
    INVALID_STATUS: "El estado proporcionado no es válido.",
    INVALID_ID: "El identificador proporcionado no es válido.",
    INVALID_DUEDATE: "La fecha de vencimiento proporcionada no es válida.",
    DATE_IS_REQUIRED: "La fecha es obligatoria.",
    DATE_IS_INVALID: "La fecha proporcionada no es válida."
} as const;

export const DEFAULT_ERROR_MESSAGE = "Ocurrió un error inesperado al obtener las tareas.";

// Key
export type TaskErrorCode = keyof typeof TASK_ERROR_MESSAGES;

// Value
export type TaskErrorMessage = typeof TASK_ERROR_MESSAGES[TaskErrorCode];