<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useTaskStore } from "~/stores/taskStore";
import { TaskStatus, TaskPriority, type Task } from "~/types/task";
import { TaskPriorityLabels, TaskStatusLabels } from "~/components/taskManager/columns";
import { calculateTimeLeft } from "~/lib/utils";

const props = defineProps<{
    id: string;
    open: boolean;
}>();

const emit = defineEmits<{ (e: "update:open", value: boolean): void }>();

// dialog state
const localOpen = ref(props.open);

watch(() => props.open, val => (localOpen.value = val));
watch(localOpen, val => emit("update:open", val));

const openDialog = () => (localOpen.value = true);
const closeDialog = () => (localOpen.value = false);

// store and task data
const store = useTaskStore();
const task = ref<Partial<Task> | null>(null);

// fetch task when dialog opens or id changes
watch([() => props.id, localOpen], async ([id, isOpen]) => {
    if (id && isOpen) {
        task.value = await store.showTask(id);
    }
});

// computed for badge variants
const priorityVariantMap: Record<TaskPriority, "default" | "secondary" | "destructive" | "outline"> = {
    [TaskPriority.HIGH]: "destructive",
    [TaskPriority.MEDIUM]: "default",
    [TaskPriority.LOW]: "secondary",
};

const statusVariantMap: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
    [TaskStatus.DONE]: "default",
    [TaskStatus.PENDING]: "secondary",
};

// formatted values
const formattedDueDate = computed(() => (task.value?.dueDate ? new Date(task.value.dueDate).toLocaleDateString() : "Sin fecha"));
const timeLeft = computed(() => {
    if (!task.value?.dueDate) return "Sin fecha";
    
    return calculateTimeLeft(task.value.dueDate);
});
</script>

<template>
    <Dialog v-model:open="localOpen">
        <slot name="trigger" :openDialog="openDialog" />

        <DialogContent @keydown.esc="closeDialog" class="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>{{ task?.title || '' }}</DialogTitle>
            </DialogHeader>

            <div class="mt-2 space-y-4">
                <div class="flex gap-2">
                    <Badge v-if="task?.priority" :variant="priorityVariantMap[task.priority]">
                        {{ TaskPriorityLabels[task.priority] }}
                    </Badge>
                    <Badge v-if="task?.status" :variant="statusVariantMap[task.status]">
                        {{ TaskStatusLabels[task.status] }}
                    </Badge>
                </div>

                <p v-if="task?.dueDate">
                    <strong>Fecha de vencimiento:</strong> {{ formattedDueDate }} ({{ timeLeft }})
                </p>

                <p>{{ task?.description || 'Sin descripción' }}</p>
            </div>

            <div class="mt-4 flex justify-end">
                <DialogClose asChild>
                    <Button variant="outline" @click="closeDialog">Cerrar</Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
</template>