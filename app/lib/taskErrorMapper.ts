import {
    TASK_ERROR_MESSAGES,
    DEFAULT_ERROR_MESSAGE,
    type TaskErrorCode,
} from "~/constants/taskErrors"

/**
 * Get error messasge from API error and map it to a human readable message
 * @param error 
 * @returns 
 */
export function getTaskErrorMessage(error: unknown): string {
    // Validate if erorr is an object, not null and has an error property (error key is sent by the API)
    if (typeof error === "object" && error !== null && "error" in error) {
        const code = (error as { error: string }).error as TaskErrorCode
        return TASK_ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE
    }

    return DEFAULT_ERROR_MESSAGE
}