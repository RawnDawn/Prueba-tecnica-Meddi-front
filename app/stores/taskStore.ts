import { defineStore } from "pinia"
import { getTasks } from "~/services/taskService"
import type { Task } from "~/types/task"

export const useTaskStore = defineStore('tasks-test', {
    state: () => ({
        tasks: [] as Task[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchTasks(page = 1) {
            this.loading = true
            this.error = null

            try {
                const res = await getTasks(page)
                this.tasks = res.data
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }
    }
})