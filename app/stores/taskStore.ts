import { defineStore } from "pinia"
import { getTaskErrorMessage } from "~/lib/taskErrorMapper"
import { createTask, getTasks, showTask, updateTask, deleteTask, markAsDone, markAsPending, getTasksByPriority, getTasksByStatus, getTopCompletedDays, getTopCreatedDays } from "~/services/taskService"
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

    // Counters
    priorityCount: {} as Record<string, number>,
    statusCount: {} as Record<string, number>,

    // Kpi days
    topCreatedDays: [] as { day: string; total: number }[],
    topCompletedDays: [] as { day: string; total: number }[],

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

    // Get task by priority count
    async getPriorityCount() {
      this.loading = true
      this.error = null

      try {
        const res = await getTasksByPriority()
        this.priorityCount = res.data
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Get task by status count
    async getStatusCount() {
      this.loading = true
      this.error = null

      try {
        const res = await getTasksByStatus()
        this.statusCount = res.data
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

        // Add to task by priority if it is the case
        const prio = res.data.priority as TaskPriority
        if (!this.tasksByPriority[prio]) {
          this.tasksByPriority[prio] = { tasks: [], pagination: { page: 1, total: 0, totalPages: 1 } }
        }
        this.tasksByPriority[prio].tasks.push(res.data)

        // Check created days counter
        this.getTopCreatedDays();

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

        // Update in general tasks
        this.tasks = this.tasks.map(t => t._id === id ? res.data : t)

        // Update in tasksByPriority if it exists
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

        // Remove from tasksByPriority
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

        // Check completed days counter
        this.getTopCompletedDays()
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
        await markAsPending(id)

        this.updateTaskStatus(id, TaskStatus.PENDING)

        // Check completed days counter
        this.getTopCompletedDays()
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // get top created days
    async getTopCreatedDays() {
      this.loading = true
      this.error = null

      try {
        const res = await getTopCreatedDays()
        this.topCreatedDays = res.data
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // get top completed days
    async getTopCompletedDays() {
      this.loading = true
      this.error = null

      try {
        const res = await getTopCompletedDays()
        this.topCompletedDays = res.data
      } catch (err: any) {
        this.error = getTaskErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    // Helper to update internal task status
    updateTaskStatus(id: string, status: TaskStatus) {
      // Find task by id and update his status
      this.tasks = this.tasks
        .map(task => task._id === id ? { ...task, taskStatus: status } : task)

      // in task by prio, iterate, find by id and update the status too
      for (const prio in this.tasksByPriority) {
        this.tasksByPriority[prio as TaskPriority].tasks =
          this.tasksByPriority[prio as TaskPriority].tasks
            .map(task => task._id === id ? { ...task, taskStatus: status } : task)
      }
    }
  }
})