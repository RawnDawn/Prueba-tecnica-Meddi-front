import { defineStore } from "pinia"
import { getTaskErrorMessage } from "~/lib/taskErrorMapper"
import { createTask, getTasks, showTask, updateTask } from "~/services/taskService"
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
                this.error = getTaskErrorMessage(err)
            } finally {
                this.loading = false
            }
        },

        async createTask(task: Partial<Task>) {
            this.loading = true
            this.error = null

            try {
                const res = await createTask(task)
                this.tasks.push(res.data)
            } catch (err: any) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        async showTask(id: string) {
            this.loading = true
            this.error = null

            try {
                const res = await showTask(id)
                return res.data
            } catch (err: any) {
                this.error = getTaskErrorMessage(err)
            } finally {
                this.loading = false
            }

        },

        async updateTask(id: string, task: Partial<Task>) {
            this.loading = true
            this.error = null

            try {
                const res = await updateTask(id, task)
                this.tasks.push(res.data)
            } catch (err: any) {
                this.error = getTaskErrorMessage(err)
            } finally {
                this.loading = false
            }
        },

        async deleteTask(id: string) {
            this.loading = true
            this.error = null

            try {
                const res = await showTask(id)
                // Remove task from the list without mutating the original array
                this.tasks.splice(this.tasks.findIndex(t => t._id === id), 1)
            } catch (err: any) {
                this.error = getTaskErrorMessage(err)
            } finally {
                this.loading = false
            }
        },
    }
})