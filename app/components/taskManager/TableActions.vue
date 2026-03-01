<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-vue-next';

defineProps < {
    task: {
        _id: string
    }
} > ();
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
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Marcar como terminada</DropdownMenuItem>
            <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
            <!-- <DropdownMenuItem @click="deleteTask(task._id)">Eliminar</DropdownMenuItem> -->
        </DropdownMenuContent>
    </DropdownMenu>
</template>