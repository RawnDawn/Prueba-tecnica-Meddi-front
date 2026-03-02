import { ref, computed, watch } from 'vue'
import { useTaskStore } from '~/stores/taskStore'
import type { ColumnFilter } from '@tanstack/vue-table';

type FilterRefs = Record<string, Ref<string>>

export async function useTaskFilterTable(filterKeys: string[]) {
    const store = useTaskStore();
    await store.fetchTasks();

    // Create dynamic ref
    const filters: FilterRefs = {}
    filterKeys.forEach(key => {
        filters[key] = ref('')
    })

    // Define column filters to pass to the tanstack table
    const columnFilters = computed(() => {
        const result: ColumnFilter[] = []
        filterKeys.forEach(key => {
            const value = filters[key]?.value
            if (value) result.push({ id: key, value })
        })
        return result
    })

    watch(
        filterKeys.map(key => filters[key]), // listen every dynamic ref
        async () => {
            store.pagination.page = 1
            const filterValues: Record<string, string> = {}
            filterKeys.forEach(key => {
                filterValues[key] = filters[key]?.value || ''
            })

            await store.fetchTasks(store.pagination.page, 10, filterValues)
        }
    )

    return {
        filters,       // to get filters on vue component
        columnFilters, // to use on tanstack table
    }

}