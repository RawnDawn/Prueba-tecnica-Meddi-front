import { defineStore } from "pinia"
import { getTaskErrorMessage } from "~/lib/taskErrorMapper"
import { createTask, getTasks, showTask, updateTask, deleteTask, markAsDone } from "~/services/taskService"
import { TaskStatus, type Task, type TaskFilters, type TaskPriority } from "~/types/task"

interface Pagination {
  page: number
  total: number
  totalPages: number
}

interface TaskState {
  tasks: Task[]
  pagination: Pagination
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    // General tasks
    tasks: [] as Task[],
    pagination: { page: 1, total: 0, totalPages: 1 } as Pagination,

    // Tasks by priority
    tasksByPriority: {} as Record<TaskPriority, TaskState>,

    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch general tasks
    async fetchTasks(page = 1, limit = 10, filters: TaskFilters = {}) {
      this.loading = true
      this.error = null

      try {
        const res = await getTasks(page, limit, filters)

        this.tasks = res.data
        this.pagination = {
          page: res.page,
          total: res.total,
          totalPages: res.totalPages
        }
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Fetch tasks by priority 
    async fetchTasksByPriority(priority: TaskPriority, page = 1, limit = 10) {
      this.loading = true
      this.error = null

      try {
        const filters: TaskFilters = { priority }
        const res = await getTasks(page, limit, filters)

        if (!this.tasksByPriority[priority]) {
          this.tasksByPriority[priority] = { tasks: [], pagination: { page: 1, total: 0, totalPages: 1 } }
        }

        this.tasksByPriority[priority].tasks = res.data
        this.tasksByPriority[priority].pagination = {
          page: res.page,
          total: res.total,
          totalPages: res.totalPages
        }
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Create task
    async createTask(task: Partial<Task>) {
      this.loading = true
      this.error = null

      try {
        const res = await createTask(task)
        this.tasks.push(res.data)

        // Agregar también a tasksByPriority si corresponde
        const prio = res.data.priority as TaskPriority
        if (!this.tasksByPriority[prio]) {
          this.tasksByPriority[prio] = { tasks: [], pagination: { page: 1, total: 0, totalPages: 1 } }
        }
        this.tasksByPriority[prio].tasks.push(res.data)
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Show task
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

    // Update task
    async updateTask(id: string, task: Partial<Task>) {
      this.loading = true
      this.error = null

      try {
        const res = await updateTask(id, task)

        // Actualizar en tasks general
        this.tasks = this.tasks.map(t => t._id === id ? res.data : t)

        // Actualizar en tasksByPriority si existe
        const prio = res.data.priority as TaskPriority
        if (this.tasksByPriority[prio]) {
          this.tasksByPriority[prio].tasks = this.tasksByPriority[prio].tasks.map(t => t._id === id ? res.data : t)
        }
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Delete task
    async deleteTask(id: string) {
      this.loading = true
      this.error = null

      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter(t => t._id !== id)

        // Eliminar de tasksByPriority
        for (const prio in this.tasksByPriority) {
          this.tasksByPriority[prio as TaskPriority].tasks =
            this.tasksByPriority[prio as TaskPriority].tasks.filter(t => t._id !== id)
        }
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Mark task as done
    async markAsDone(id: string) {
      this.loading = true
      this.error = null

      try {
        await markAsDone(id)

        this.updateTaskStatus(id, TaskStatus.DONE)
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Mark task as pending
    async markAsPending(id: string) {
      this.loading = true
      this.error = null

      try {
        // Asumiendo que markAsDone también sirve para revertir
        await markAsDone(id)

        this.updateTaskStatus(id, TaskStatus.PENDING)
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Helper interno para actualizar status en todas las listas
    updateTaskStatus(id: string, status: TaskStatus) {
      this.tasks = this.tasks.map(t => t._id === id ? { ...t, taskStatus: status } : t)

      for (const prio in this.tasksByPriority) {
        this.tasksByPriority[prio as TaskPriority].tasks =
          this.tasksByPriority[prio as TaskPriority].tasks.map(t => t._id === id ? { ...t, taskStatus: status } : t)
      }
    }
  }
})