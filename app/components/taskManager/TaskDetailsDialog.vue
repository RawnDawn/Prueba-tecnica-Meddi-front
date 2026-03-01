<script setup lang="ts">
import { ref, watchEffect } from "vue"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTaskStore } from "~/stores/taskStore"
import { TaskStatus, type Task } from "~/types/task";
import { TaskPriority } from "../../types/task";
import { TaskPriorityLabels, TaskStatusLabels } from "./columns";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
    id: string,
}>()

// dialog state
const open = ref(false)
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()
const openDialog = () => {
    open.value = true
    emit('update:open', true) // notifica al padre
}
const closeDialog = () => {
    open.value = false
    emit('update:open', false) // notifica al padre
}

// Get task details
const store = useTaskStore();
const task = ref<Partial<Task> | null>(null)

// Fetch task details when dialog opens
watchEffect(async () => {
    if (!props.id) return
    task.value = await store.showTask(props.id)
})

const formatDate = (date: string | Date) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString()
}

// Priority cell logic
const priorityVariantMap: Record<TaskPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [TaskPriority.HIGH]: 'destructive',
    [TaskPriority.MEDIUM]: 'default',
    [TaskPriority.LOW]: 'secondary',
};

// Status cell logic
const statusVariantMap: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [TaskStatus.DONE]: 'default',
    [TaskStatus.PENDING]: 'secondary',
};

/**
 * Show time left to due date
 * @param dueDate 
 */
const timeLeft = (dueDate: string | Date) => {
    if (!dueDate) return "Sin fecha";

    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();

    if (diffMs <= 0) return "Vencida";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    if (diffDays > 0) return `${diffDays} día${diffDays > 1 ? "s" : ""}`;
    if (diffHours > 0) return `${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
};

</script>

<template>
    <Dialog :open="open" @openChange="(val: boolean) => open = val">
        <slot name="trigger" :openDialog="openDialog" />

        <DialogContent @keydown.esc="emit('update:open', false)" class="sm:max-w-sm">
            <DialogHeader>
                <div class="flex flex-col gap-2">
                    <DialogTitle>{{ task ? task.title : '' }}</DialogTitle>
                    <div class="flex flex-row gap-2">
                        <Badge v-if="task?.priority" :variant="priorityVariantMap[task.priority]">
                            {{ TaskPriorityLabels[task.priority] }}
                        </Badge>

                        <Badge v-if="task?.status" :variant="statusVariantMap[task.status]">
                            {{ TaskStatusLabels[task.status] }}
                        </Badge>
                    </div>
                </div>
            </DialogHeader>

            <div class="mt-2">
                <p class="mb-4" v-if="task?.dueDate">
                    <strong>Fecha de vencimiento:</strong>
                    {{ formatDate(task.dueDate) || 'Sin fecha devencimiento' }} ({{ timeLeft(task?.dueDate) }})
                </p>

                <p v-if="task?.description" class="mb-4">{{ task.description }}</p>
            </div>

            <div class="mt-4 flex justify-end">
                <DialogClose asChild>
                    <Button variant="outline" @click="closeDialog">Cerrar</Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
</template>