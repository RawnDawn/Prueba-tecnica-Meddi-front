<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Field, FieldDescription, FieldGroup } from '~/components/ui/field'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

import { ref, watch } from 'vue'
import { taskUpdateSchema } from '~/schemas/taskSchema'
import { TaskPriority, TaskStatus, type Task } from '~/types/task'
import { useTaskStore } from '~/stores/taskStore'
import DuePicker from '~/components/taskManager/DuePicker.vue'
import Alert from '../common/Alert.vue'
import { getTaskErrorMessage } from '~/lib/taskErrorMapper'

const props = defineProps<{
    id: string
    open: boolean
}>()

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const store = useTaskStore()

const formData = ref({
    title: '',
    description: '',
    priority: '',
    status: '',
    dueDate: ''
})

// pivot to set and send prio to formData
const selectedPriority = ref<TaskPriority | 'low' | 'medium' | 'high'>('medium')
// pivot to set and send status to formData
const selectedStatus = ref<TaskStatus | 'pending' | 'done'>('pending')
// Get due date from picker
const dueDate = ref<string>('')

// Errors
const errors = ref<{ [key: string]: string }>({})
const apiError = ref<string>('')

// Reset form
const resetForm = () => {
    errors.value = {}
    apiError.value = ''
}

// Load data when dialog is opened
watch(
    () => props.open,
    async (isOpen) => {
        if (isOpen && props.id) {
            try {
                const task = await store.showTask(props.id)
                if (task) {
                    formData.value = {
                        title: task.title || '',
                        description: task.description || '',
                        priority: task.priority as TaskPriority,
                        status: task.status as TaskStatus,
                        dueDate: task.dueDate || ''
                    }
                    selectedPriority.value = task.priority as TaskPriority
                    selectedStatus.value = task.status as TaskStatus
                    dueDate.value = task.dueDate || ''
                }
            } catch (err) {
                console.error('Error cargando tarea:', err)
            }
        }

        if (!isOpen) resetForm()
    }
)

// Submit
const handleSubmit = async () => {
    errors.value = {}

    formData.value.priority = selectedPriority.value
    formData.value.status = selectedStatus.value
    formData.value.dueDate = dueDate.value

    const result = taskUpdateSchema.safeParse(formData.value)

    if (!result.success) {
        // For each error, show the message
        result.error.issues.forEach((issue) => {
            const key = issue.path[0] as string
            errors.value[key] = issue.message
        })
        return
    }

    try {
        // Here we need to cast the priority to the correct type
        await store.updateTask(props.id, {
            ...result.data,
            priority: result.data.priority as TaskPriority,
            status: result.data.status as TaskStatus
        })

        await store.fetchTasks()

        // Cerrar diálogo
        emit('update:open', false)
        resetForm()
    } catch (err) {
        apiError.value = getTaskErrorMessage(err)
    }
}
</script>

<template>
    <Dialog :open="props.open" @openChange="(val: boolean) => emit('update:open', val)">
        <slot name="trigger" :openDialog="() => emit('update:open', true)" />

        <DialogContent class="sm:max-w-sm">
            <form @submit.prevent="handleSubmit" novalidate>
                <DialogHeader class="mb-2">
                    <DialogTitle>Actualizar tarea</DialogTitle>
                    <Separator />
                    <DialogDescription>
                        Llena el formulario para actualizar una tarea existente.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup class="mb-5">
                    <!-- Title -->
                    <Field :data-invalid="errors.title">
                        <Label for="title">Titulo <span class="text-destructive">*</span></Label>
                        <Input id="title" v-model="formData.title" :class="errors.title ? 'border-destructive' : ''" />
                        <FieldDescription v-if="errors.title" class="text-destructive text-sm">
                            {{ errors.title }}
                        </FieldDescription>
                    </Field>

                    <!-- description -->
                    <Field :data-invalid="errors.description">
                        <Label for="description">Descripción</Label>
                        <Textarea id="description" v-model="formData.description"
                            :class="errors.description ? 'border-destructive' : ''" />
                        <FieldDescription v-if="errors.description" class="text-destructive text-sm">
                            {{ errors.description }}
                        </FieldDescription>
                    </Field>

                    <!-- prio -->
                    <Field :data-invalid="errors.priority">
                        <Label class="mb-3">Prioridad <span class="text-destructive">*</span></Label>
                        <Select :default-value="selectedPriority"
                            @update:model-value="(value) => selectedPriority = value as TaskPriority">
                            <SelectTrigger :aria-invalid="errors.priority">
                                <SelectValue placeholder="Selecciona la prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="low" class="text-green-500">Baja</SelectItem>
                                    <SelectItem value="medium" class="text-yellow-500">Media</SelectItem>
                                    <SelectItem value="high" class="text-destructive">Alta</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription v-if="errors.priority" class="text-destructive text-sm">
                            {{ errors.priority }}
                        </FieldDescription>
                    </Field>

                    <!-- status -->
                    <Field :data-invalid="errors.status">
                        <Label class="mb-3">Estado <span class="text-destructive">*</span></Label>
                        <Select :default-value="selectedStatus"
                            @update:model-value="(value) => selectedStatus = value as TaskStatus">
                            <SelectTrigger :aria-invalid="errors.status">
                                <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="done" class="text-green-500">Completada</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription v-if="errors.status" class="text-destructive text-sm">
                            {{ errors.status }}
                        </FieldDescription>
                    </Field>

                    <!-- Due date -->
                    <Field :data-invalid="errors.dueDate">
                        <Label>Fecha de vencimiento</Label>
                        <DuePicker v-model="dueDate" />
                        <FieldDescription v-if="errors.dueDate" class="text-destructive text-sm">
                            {{ errors.dueDate }}
                        </FieldDescription>
                    </Field>
                </FieldGroup>

                <!-- api errors -->
                <div class="mb-5">
                    <Alert v-if="apiError" variant="destructive" :text="apiError" />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button as="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>