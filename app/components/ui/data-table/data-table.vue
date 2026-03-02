<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import { ref } from "vue";
import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useVueTable,
    getFilteredRowModel,
    getSortedRowModel
} from '@tanstack/vue-table';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TaskStatus } from '~/types/task';

const props = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}>()

// set sorting
const sorting = ref<SortingState>([])

// Set column filters
const statusFilter = ref("")
const dateFilter = ref("")
const titleFilter = ref("")

const columnFilters = computed(() => {
    const filters: { id: string; value: string }[] = [];

    if (statusFilter.value) {
        filters.push({ id: "status", value: statusFilter.value });
    }

    if (dateFilter.value) {
        filters.push({ id: "dueDate", value: dateFilter.value });
    }

    if (titleFilter.value) {
        filters.push({ id: "title", value: titleFilter.value });
    }

    return filters;
});

const table = useVueTable({
    get data() { return props.data },
    get columns() { return props.columns },
    state: {
        get sorting() {
            return sorting.value
        },

        get columnFilters() {
            return columnFilters.value
        }
    },
    onSortingChange: updaterOrValue => {
        sorting.value = typeof updaterOrValue === 'function'
            ? updaterOrValue(sorting.value)
            : updaterOrValue
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
})
</script>

<template>
    <div class="flex flex-wrap gap-4">
        <!-- Filter by title -->
        <div>
            <Input id="title" name="title" v-model="titleFilter" placeholder="Buscar por título" />
        </div>

        <!-- Filter by status -->
        <Select default-value="" v-model="statusFilter">
            <SelectTrigger>
                <SelectValue placeholder="Filtar por estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem :value="null">Todos los estados</SelectItem>
                    <SelectItem :value="TaskStatus.PENDING">Pendiente</SelectItem>
                    <SelectItem :value="TaskStatus.DONE" class="text-green-500">Completada</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

        <!-- Filter by due date -->
        <DuePicker v-model="dateFilter" />

    </div>

    <div class="border rounded-sm bg-foreground-tertiary bg-[#17181c]">
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
</template>