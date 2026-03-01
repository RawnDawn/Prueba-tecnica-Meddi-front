import type { Task } from "~/types/task";
import { API_BASE_URL } from "~/constants/api";
import type { PaginatedResponse } from "~/types/paginatedResponse";
import { DEFAULT_ERROR_MESSAGE, TASK_ERROR_MESSAGES, type TaskErrorCode } from "~/constants/taskErrors";

const TASK_URL = API_BASE_URL + "/tasks";

/**
 * Fetch tasks
 * @param page 
 * @param limit 
 * @returns 
 */
export const getTasks = async (
    page = 1,
    limit = 10
): Promise<PaginatedResponse<Task[]>> => {
    const res = await fetch(`${TASK_URL}?page=${page}&limit=${limit}`)

    const body = await res.json()

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;

        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;

        throw new Error(message);
    }

    return body
}

/**
 * Create a new task
 * @param task 
 * @returns 
 */
export const createTask = async (
    task: Partial<Task>
) => {
    const res = await fetch(TASK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    })

    const body = await res.json()

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;

        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;

        throw new Error(message);
    }

    return body
}

/**
 * Get task by id
 * @param id 
 * @returns 
 */
export const showTask = async (
    id: string
) => {
    const res = await fetch(`${TASK_URL}/${id}`)

    const body = await res.json()

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;

        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;

        throw new Error(message);
    }

    return body
}

/**
 * Update a task
 * @param id 
 * @param task 
 * @returns 
 */
export const updateTask = async (
    id: string,
    task: Partial<Task>
) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    })

    const body = await res.json()

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;

        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;

        throw new Error(message);
    }

    return body
}

/**
 * Delete a task
 * @param id 
 * @returns 
 */
export const deleteTask = async (
    id: string
) => {
    const res = await fetch(`${TASK_URL}/${id}`, {
        method: "DELETE",
    });

    // No Content, all good
    if (res.status === 204) {
        return;
    }

    const body = await res.json();

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;
        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;
        throw new Error(message);
    }

    return;
}

export const markAsDone = async (
    id: string
) => {
    const res = await fetch(`${TASK_URL}/${id}/done`, {
        method: "PUT",
    })

    const body = await res.json()

    if (!res.ok) {
        const errorCode = body.error as TaskErrorCode;

        const message =
            TASK_ERROR_MESSAGES[errorCode] ??
            DEFAULT_ERROR_MESSAGE;

        throw new Error(message);
    }

    return body
}