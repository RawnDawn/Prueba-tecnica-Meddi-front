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
import { TaskStatus, type Task } from '~/types/task';
import CreateDialog from "~/components/taskManager/CreateDialog.vue";
import { useTaskStore } from "~/stores/taskStore"
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX, Search, ChevronLeft, ChevronRight, Info } from "lucide-vue-next";
import { columns } from './columns';
import { DataTable } from '../ui/data-table';


const store = useTaskStore();

await store.fetchTasks();

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

// Fetch per filter
watch(
    [titleFilter, statusFilter, dateFilter],
    async () => {
        store.pagination.page = 1

        await store.fetchTasks(store.pagination.page, 10, {
            title: titleFilter.value,
            status: statusFilter.value,
            dueDate: dateFilter.value
        })
    },
    { immediate: false } // only run when the value changes
)

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

    <div class="flex flex-col-reverse lg:flex-row lg:items-center justify-between flex-wrap gap-5 lg:gap-4 mb-4">
        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-5 lg:gap-4">
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
            <DuePicker :clearable="true" v-model="dateFilter" />
        </div>

        <div>
            <CreateDialog />
        </div>

    </div>

    <DataTable :table="table" :dataCount="columns.length" />

    <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button variant="outline" :disabled="store.pagination.page === 1 || store.loading"
            @click="store.fetchTasks(store.pagination.page - 1)">
            <ChevronLeft />
        </Button>

        <span>Página {{ store.pagination.page }} de {{ store.pagination.totalPages }}</span>

        <Button variant="outline" :disabled="store.pagination.page === store.pagination.totalPages || store.loading"
            @click="store.fetchTasks(store.pagination.page + 1)">
            <ChevronRight />
        </Button>
    </div>
</template>