<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { CheckCircle, EllipsisVertical, Eye, Pencil, Trash } from 'lucide-vue-next'

import TaskDetailsDialog from './TaskDetailsDialog.vue'
import UpdateTaskDialog from './UpdateTaskDialog.vue'
import DeleteTaskDialog from './DeleteTaskDialog.vue'
import { TaskStatus } from '~/types/task'
import { useTaskStore } from '~/stores/taskStore'

// Correctly capture props
const props = defineProps<{
    task: { _id: string, status: string }
}>()

// Dialog states
const showTaskDialog = ref(false)
const updateTaskDialog = ref(false)
const deleteTaskDialog = ref(false)

// status logic
const store = useTaskStore()
const markAsDone = async () => {
    await store.markAsDone(props.task._id)
    props.task.status = TaskStatus.DONE
}
const markAsPending = async () => {
    await store.markAsPending(props.task._id)
    props.task.status = TaskStatus.PENDING
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <EllipsisVertical />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="showTaskDialog = true">
                <Eye /> Ver tarea
            </DropdownMenuItem>

            <DropdownMenuItem class="text-green-400" v-if="props.task.status !== TaskStatus.DONE" @click="markAsDone">
                <CheckCircle /> Marcar como terminada
            </DropdownMenuItem>

            <DropdownMenuItem class="text-yellow-400" v-if="props.task.status !== TaskStatus.PENDING"
                @click="markAsPending">
                <CheckCircle /> Marcar como pendiente
            </DropdownMenuItem>

            <DropdownMenuItem class="text-blue-400" @click="updateTaskDialog = true">
                <Pencil /> Editar
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" @click="deleteTaskDialog = true">
                <Trash /> Eliminar
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <TaskDetailsDialog :id="props.task._id" v-model:open="showTaskDialog" />
    <UpdateTaskDialog :id="props.task._id" v-model:open="updateTaskDialog" />
    <DeleteTaskDialog :id="props.task._id" v-model:open="deleteTaskDialog" />
</template>