<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, Table } from '@tanstack/vue-table';
import {
    FlexRender,
} from '@tanstack/vue-table';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

defineProps<{
    table: Table<TData>
    dataCount: number
}>()

</script>


<template>
    <div class="border rounded-sm bg-foreground-tertiary bg-[#17181c] mb-4">
        <Table>
            <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <TableHead class="font-bold" v-for="header in headerGroup.headers" :key="header.id"
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
                        <TableCell v-if="dataCount == 0" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </template>
            </TableBody>
        </Table>
    </div>
</template>