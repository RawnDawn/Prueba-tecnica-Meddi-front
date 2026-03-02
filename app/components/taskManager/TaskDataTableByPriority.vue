<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import { ref } from "vue";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useVueTable,

} from '@tanstack/vue-table';
import { useTaskStore } from "~/stores/taskStore"
import { columns } from './columns';
import type { TaskPriority } from '~/types/task';
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {DataTable} from '../ui/data-table';

const props = defineProps<{
    priority: TaskPriority
}>()

const store = useTaskStore();

// init state for tasks
await store.fetchTasksByPriority(props.priority, 1, 10);

// set sorting
const sorting = ref<SortingState>([])


const table = useVueTable({
    get data() { return store.tasksByPriority[props.priority]?.tasks as TData[] },
    get columns() { return columns as ColumnDef<TData, TValue>[] },
    onSortingChange: updaterOrValue => {
        sorting.value = typeof updaterOrValue === 'function'
            ? updaterOrValue(sorting.value)
            : updaterOrValue
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
})

</script>

<template>

    <DataTable :table="table" :dataCount="columns.length" />

    <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button variant="outline"
            :disabled="store.tasksByPriority[props.priority].pagination.page === 1 || store.loading"
            @click="store.fetchTasksByPriority(props.priority, store.tasksByPriority[props.priority].pagination.page - 1, 10)">
            <ChevronLeft />
        </Button>

        <span>Página {{ store.tasksByPriority[props.priority].pagination.page }} de {{
            store.tasksByPriority[props.priority].pagination.totalPages }}</span>

        <Button variant="outline"
            :disabled="store.tasksByPriority[props.priority].pagination.page === store.tasksByPriority[props.priority].pagination.totalPages || store.loading"
            @click="store.fetchTasksByPriority(props.priority, store.tasksByPriority[props.priority].pagination.page + 1, 10)">
            <ChevronRight />
        </Button>
    </div>
</template>