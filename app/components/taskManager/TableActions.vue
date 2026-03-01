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
import { CheckCircle, Ellipsis, Eye, Pencil, Trash } from 'lucide-vue-next'

import TaskDetailsDialog from './TaskDetailsDialog.vue'
import UpdateTaskDialog from './UpdateTaskDialog.vue'
import { TaskStatus } from '~/types/task'
import DeleteTaskDialog from './DeleteTaskDialog.vue'

defineProps<{
    task: { _id: string, taskStatus: string }
}>()

// Dialog states
const showTaskDialog = ref(false)
const updateTaskDialog = ref(false)
const deleteTaskDialog = ref(false)
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <Ellipsis />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="showTaskDialog = true">
                <Eye /> Ver tarea
            </DropdownMenuItem>

            <DropdownMenuItem class="text-green-400" v-if="task.taskStatus !== TaskStatus.DONE">
                <CheckCircle /> Marcar como terminada
            </DropdownMenuItem>

            <DropdownMenuItem class="text-blue-400" @click="updateTaskDialog = true">
                <Pencil /> Editar
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive" @click="deleteTaskDialog = true">
                <Trash /> Eliminar
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <TaskDetailsDialog :id="task._id" v-model:open="showTaskDialog" />
    <UpdateTaskDialog :id="task._id" v-model:open="updateTaskDialog" />
    <DeleteTaskDialog :id="task._id" v-model:open="deleteTaskDialog" />
</template>