import { h } from 'vue'
import PriorityCell from '~/components/taskManager/PriorityCell.vue';
import { TaskPriority, TaskStatus, type Task } from '~/types/task'
import type { ColumnDef } from '@tanstack/vue-table'
import TableActions from '~/components/taskManager/TableActions.vue';
import StatusCell from './StatusCell.vue';

/**
 * Convert task priority response into readeable content
 */
export const TaskPriorityLabels: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "Baja",
    [TaskPriority.MEDIUM]: "Media",
    [TaskPriority.HIGH]: "Alta",
};

/**
 * Convert task status response into readeable content
 */
export const TaskStatusLabels: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: "Pendiente",
    [TaskStatus.DONE]: "Completada",
};

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: 'title',
        header: 'Titulo',
        filterFn: 'includesString'
    },
    {
        accessorKey: 'priority',
        header: 'Prioridad',
        cell: ({ row }) => {
            const { priority } = row.original;

            // Set color by task priority
            const variantMap: Record<TaskPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
                [TaskPriority.HIGH]: 'destructive',
                [TaskPriority.MEDIUM]: 'default',
                [TaskPriority.LOW]: 'secondary',
            };
            const variant = variantMap[priority];

            const label = TaskPriorityLabels[priority];

            return h(PriorityCell, {
                task: row.original,
                priority: label,
                variant,
            });
        },
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            const status = row.original.status;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline';

            const variantMap: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
                [TaskStatus.DONE]: 'default',
                [TaskStatus.PENDING]: 'secondary',
            };

            variant = variantMap[status];

            const label = TaskStatusLabels[status];

            return h(StatusCell, {
                task: row.original,
                status: label,
                variant,
            });
        }
    },
    {
        accessorKey: 'dueDate',
        header: 'Fecha de vencimiento',
        cell: (row) => {
            const date = new Date(row.getValue() as string);

            // Format date with day, month and year
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();

            return `${day}/${month}/${year}`;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const task = row.original

            return h('div', { class: 'relative' }, h(TableActions, {
                task,
            }))
        },
    }
]