import { defineStore } from "pinia"
import { ref } from "vue"
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
    }

    return { tasks, loading, error, fetchTasks }
});