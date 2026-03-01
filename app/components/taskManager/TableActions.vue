<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import TaskDetailsDialog from './TaskDetailsDialog.vue';
import { CheckCircle, Ellipsis, Eye, Pencil, Trash } from 'lucide-vue-next';
import UpdateTaskDialog from './UpdateTaskDialog.vue';

defineProps<{
    task: {
        _id: string
    }
}>();

const showTaskDialog = ref(false)
const updateTaskDialog = ref(false)
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <Ellipsis />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem @click="showTaskDialog = true">
                <Eye />
                Ver tarea
            </DropdownMenuItem>

            <DropdownMenuItem class="text-green-400">
                <CheckCircle />
                Marcar como terminada
            </DropdownMenuItem>

            <DropdownMenuItem class="text-blue-400" @click="updateTaskDialog = true">
                <Pencil />
                Editar
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive">
                <Trash />
                Eliminar
            </DropdownMenuItem>
            <!-- <DropdownMenuItem>Cambiar estado</DropdownMenuItem> -->
            <!-- <DropdownMenuItem @click="deleteTask(task._id)">Eliminar</DropdownMenuItem> -->
        </DropdownMenuContent>
    </DropdownMenu>

    <TaskDetailsDialog :id="task._id" v-model:open="showTaskDialog" />
    <UpdateTaskDialog :id="task._id" v-model:open="updateTaskDialog" />
</template>