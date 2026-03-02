<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import { ref } from "vue";
import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useVueTable,

} from '@tanstack/vue-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTaskStore } from "~/stores/taskStore"
import { columns } from './columns';
import type { TaskPriority } from '~/types/task';

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

    <div class="border rounded-sm bg-foreground-tertiary bg-[#17181c] mb-4">
        <Table>
            <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <TableHead v-for="header in headerGroup.headers" :key="header.id"
                        @click="header.column.getToggleSortingHandler()?.($event)">
                        <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                            :props="header.getContext()" />
                        <!-- Show icon sort -->
                        {{
                            header.column.getIsSorted()
                                ? { asc: '▲', desc: '▼' }[header.column.getIsSorted() as 'asc' | 'desc']
                                : ''
                        }}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="table.getRowModel().rows?.length">
                    <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                        :data-state="row.getIsSelected() ? 'selected' : undefined">
                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                        </TableCell>
                    </TableRow>
                </template>
                <template v-else>
                    <TableRow>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>

    <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button variant="outline"
            :disabled="store.tasksByPriority[props.priority].pagination.page === 1 || store.loading"
            @click="store.fetchTasksByPriority(props.priority, store.tasksByPriority[props.priority].pagination.page - 1, 10)">
            Anterior
        </Button>

        <span>Página {{ store.tasksByPriority[props.priority].pagination.page }} de {{
            store.tasksByPriority[props.priority].pagination.totalPages }}</span>

        <Button variant="outline"
            :disabled="store.tasksByPriority[props.priority].pagination.page === store.tasksByPriority[props.priority].pagination.totalPages || store.loading"
            @click="store.fetchTasksByPriority(props.priority, store.tasksByPriority[props.priority].pagination.page + 1, 10)">
            Siguiente
        </Button>
    </div>
</template>