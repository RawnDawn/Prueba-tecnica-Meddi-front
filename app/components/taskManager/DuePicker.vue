<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { parseDate, type DateValue } from "@internationalized/date"
import { Calendar } from "~/components/ui/calendar"
import { Button } from "~/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-vue-next"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "~/components/ui/popover"

const props = defineProps<{
    modelValue: string | undefined
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string | undefined): void
}>()

const internalDate = ref<DateValue | undefined>(undefined)

// Sync internal date with modelValue
watch(
    () => props.modelValue,
    (val) => {
        if (!val) {
            internalDate.value = undefined
        } else {
            internalDate.value = parseDate(val.slice(0, 10))
        }
    },
    { immediate: true }
)

/**
 * Format the date to dd/mm/yyyy
 */
const formattedDate = computed(() => {
    if (!internalDate.value) return "Selecciona una fecha"

    const day = String(internalDate.value.day).padStart(2, "0")
    const month = String(internalDate.value.month).padStart(2, "0")
    const year = internalDate.value.year

    return `${day}/${month}/${year}`
})

/**
 * Send value to the parent component
 * @param val 
 */
const updateDate = (val: DateValue | undefined) => {
    internalDate.value = val

    if (!val) {
        emit("update:modelValue", undefined)
        return
    }

    const isoString = val.toDate("UTC").toISOString()
    emit("update:modelValue", isoString)
}
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" class="w-[280px] justify-start text-left font-normal">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ formattedDate }}
            </Button>
        </PopoverTrigger>

        <PopoverContent class="w-auto p-0">
            <Calendar mode="single" :v-model="internalDate" @update:model-value="updateDate" />
        </PopoverContent>
    </Popover>
</template>