import { defineStore } from "pinia"
import { ref } from "vue"
import { TASK_ERROR_MESSAGES } from "~/constants/taskErrors";
import { getTasks } from "~/services/taskService"
import type { Task } from "~/types/task"

export const useTaskStore = defineStore("tasks", () => {
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchTasks = async (page = 1) => {
        loading.value = true
        error.value = null

        try {
            const res = await getTasks(page)
            tasks.value = res.data
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }

        // TODO - remove this
        // error.value = "test"

    }

    return { tasks, loading, error, fetchTasks }
});