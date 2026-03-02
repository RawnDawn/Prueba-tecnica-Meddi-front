import { ref, watch } from 'vue'
import { taskUpdateSchema } from '~/schemas/taskSchema'
import { TaskPriority, TaskStatus } from '~/types/task'
import { useTaskStore } from '~/stores/taskStore'
import { getTaskErrorMessage } from '~/lib/taskErrorMapper'

export function useUpdateTaskForm(taskId: string, open: boolean) {
    const store = useTaskStore()

    // Form state
    const formData = ref({
        title: '',
        description: '',
        priority: '',
        status: '',
        dueDate: ''
    })

    const selectedPriority = ref<TaskPriority | 'low' | 'medium' | 'high'>('medium')
    const selectedStatus = ref<TaskStatus | 'pending' | 'done'>('pending')
    const dueDate = ref<string>('')

    // Errors
    const errors = ref<{ [key: string]: string }>({})
    const apiError = ref<string>('')

    // Dialog open
    const localOpen = ref(open)

    // Reset form
    const resetForm = () => {
        errors.value = {}
        apiError.value = ''
    }

    // Load task data when dialog opens
    watch(
        () => localOpen.value,
        async (isOpen) => {
            if (isOpen && taskId) {
                try {
                    const task = await store.showTask(taskId)
                    if (task) {
                        formData.value = {
                            title: task.title || '',
                            description: task.description || '',
                            priority: task.priority,
                            status: task.status,
                            dueDate: task.dueDate || ''
                        }
                        selectedPriority.value = task.priority as TaskPriority
                        selectedStatus.value = task.status as TaskStatus
                        dueDate.value = task.dueDate || ''
                    }
                } catch (err) {
                    console.error('Error loading task:', err)
                }
            } else if (!isOpen) {
                resetForm()
            }
        },
        { immediate: true }
    )

    // Submit form
    const handleSubmit = async () => {
        errors.value = {}

        formData.value.priority = selectedPriority.value
        formData.value.status = selectedStatus.value
        formData.value.dueDate = dueDate.value

        const result = taskUpdateSchema.safeParse(formData.value)

        if (!result.success) {
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as string
                errors.value[key] = issue.message
            })
            return
        }

        try {
            await store.updateTask(taskId, {
                ...result.data,
                priority: result.data.priority as TaskPriority,
                status: result.data.status as TaskStatus
            })
            await store.fetchTasks()
            localOpen.value = false
            resetForm()
        } catch (err) {
            apiError.value = getTaskErrorMessage(err)
        }
    }

    return {
        formData,
        selectedPriority,
        selectedStatus,
        dueDate,
        errors,
        apiError,
        localOpen,
        handleSubmit,
        resetForm
    }
}