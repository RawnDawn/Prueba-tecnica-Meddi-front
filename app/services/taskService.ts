import type { Task } from "~/types/task";
import { API_BASE_URL } from "~/constants/api";
import type { PaginatedResponse } from "~/types/paginatedResponse";

const TASK_URL = API_BASE_URL + "/tasks";

export const getTasks = async (
    page = 1,
    limit = 10
): Promise<PaginatedResponse<Task[]>> => {
    const res = await fetch(`${TASK_URL}?page=${page}&limit=${limit}`)

    const body = await res.json()

    if (!res.ok) {
        throw new Error(body.error || "TASK_SERVICE_ERROR")
    }

    return body
}