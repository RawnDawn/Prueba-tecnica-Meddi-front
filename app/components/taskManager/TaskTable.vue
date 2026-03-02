<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import { ref } from "vue";
import {
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
import { TaskStatus } from '~/types/task';
import CreateDialog from "~/components/taskManager/CreateDialog.vue";
import { useTaskStore } from "~/stores/taskStore"
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX, Search, Info } from "lucide-vue-next";
import { columns } from './columns';
import { DataTable, Pagination } from '~/components/ui/data-table';
import { useTaskFilterTable } from '~/composables/useTaskFilterTable';

const store = useTaskStore();

await store.fetchTasks();

// set sorting
const sorting = ref<SortingState>([])

// filters
const { filters, columnFilters } = await useTaskFilterTable(
    ['title', 'status', 'dueDate']
);

// Get filters from the composable
const titleFilter = filters.title;
const statusFilter = filters.status;
const dueDateFilter = filters.dueDate;

const table = useVueTable({
    get data() { return store.tasks as TData[] },
    get columns() { return columns as ColumnDef<TData, TValue>[] },
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
    <IconBadge v-if="store.error" :text="store.error" variant="destructive">
        <CircleX data-icon="inline-end" />
    </IconBadge>

    <div class="grid xl:grid-cols-12 gap-5 lg:gap-4 mb-4">
        <!-- Filters  flex flex-wrap items-center -->
        <div class="col-span-full grid grid-cols-1 gap-4 xl:gap-0 md:grid-cols-3 lg:grid-cols-4 xl:col-span-10">
            <!-- Filter by title -->
            <div class="flex gap-2 items-center justify-center  w-full lg:w-auto">
                <Search class="w-5 h-5" />
                <Input class="text-sm" id="title" name="title" v-model="titleFilter" placeholder="Buscar por título" />
            </div>

            <!-- Filter by status -->
            <Select default-value="" v-model="statusFilter">
                <div class="flex gap-2 items-center justify-center  w-full lg:w-auto">
                    <Info class="w-5 h-5" />
                    <SelectTrigger class="w-full lg:w-auto">
                        <SelectValue placeholder="Filtar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="null">Todos los estados</SelectItem>
                            <SelectItem :value="TaskStatus.PENDING">Pendiente</SelectItem>
                            <SelectItem :value="TaskStatus.DONE" class="text-green-500">Completada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </div>
            </Select>

            <!-- Filter by due date -->
            <DuePicker :clearable="true" v-model="dueDateFilter" />
        </div>

        <div class="col-span-full xl:col-span-2 xl:justify-self-end order-first xl:order-last">
            <CreateDialog />
        </div>

    </div>

    <DataTable :table="table" :dataCount="columns.length" />

    <Pagination :disabled-preview="store.pagination.page === 1 || store.loading"
        :disabled-next="store.pagination.page === store.pagination.totalPages || store.loading"
        :page="store.pagination.page" :total-pages="store.pagination.totalPages"
        @click-prev="store.fetchTasks(store.pagination.page - 1)"
        @click-next="store.fetchTasks(store.pagination.page + 1)" />

</template>