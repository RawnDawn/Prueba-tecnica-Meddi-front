import { ref, watch } from 'vue'
import { taskSchema } from '~/schemas/taskSchema'
import type { TaskPriority } from '~/types/task'
import { useTaskStore } from '~/stores/taskStore'
import { getTaskErrorMessage } from '~/lib/taskErrorMapper'

export function useCreateTaskForm() {
    const store = useTaskStore()

    // Form state
    const formData = ref({
        title: '',
        description: '',
        priority: '',
        dueDate: ''
    })

    const selectedPriority = ref<TaskPriority | 'low' | 'medium' | 'high'>('medium')
    const dueDate = ref<string>('')

    // Error handling
    const errors = ref<{ [key: string]: string }>({})
    const apiError = ref<string>('')

    // Open/close dialog
    const open = ref(false)

    const resetForm = () => {
        formData.value = { title: '', description: '', priority: '', dueDate: '' }
        selectedPriority.value = 'medium'
        dueDate.value = ''
        errors.value = {}
        apiError.value = ''
    }

    // Reset form on close
    watch(open, (val) => {
        if (!val) resetForm()
    })

    // Submit logic
    const handleSubmit = async () => {
        errors.value = {}
        apiError.value = ''

        // Set priority & dueDate
        formData.value.priority = selectedPriority.value
        formData.value.dueDate = dueDate.value

        // Validate
        const result = taskSchema.safeParse(formData.value)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                const key = issue.path[0] as string
                errors.value[key] = issue.message
            })
            return
        }

        try {
            await store.createTask({
                ...result.data,
                priority: result.data.priority as TaskPriority
            })

            await store.fetchTasks()
            open.value = false
        } catch (err) {
            apiError.value = getTaskErrorMessage(err)
        }
    }

    return {
        open,
        formData,
        selectedPriority,
        dueDate,
        errors,
        apiError,
        handleSubmit,
        resetForm
    }
}