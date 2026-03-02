import { h } from 'vue'
import PriorityCell from '~/components/taskManager/PriorityCell.vue';
import { TaskPriority, TaskStatus, type Task } from '~/types/task'
import type { ColumnDef } from '@tanstack/vue-table'
import TableActions from '~/components/taskManager/TableActions.vue';
import StatusCell from './StatusCell.vue';
import { AlertCircle, Smile, AlertTriangle, CheckCircle, Clock } from 'lucide-vue-next';

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

            const mapIcon = {
                [TaskPriority.HIGH]: AlertTriangle,
                [TaskPriority.MEDIUM]: AlertCircle,
                [TaskPriority.LOW]: Smile
            }

            return h(PriorityCell, {
                priority: label,
                variant,
                icon: mapIcon[priority]
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

            const mapIcon = {
                [TaskStatus.DONE]: CheckCircle,
                [TaskStatus.PENDING]: Clock,
            }

            return h(StatusCell, {
                status: label,
                variant,
                icon: mapIcon[status]
            });
        }
    },
    {
        accessorKey: 'dueDate',
        header: 'Fecha de vencimiento',
        cell: (row) => {
            const date = new Date(row.getValue() as string);

            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC'
            });
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