<script setup lang="ts">
import { useTaskStore } from "~/stores/taskStore";
import { Calendar } from "lucide-vue-next"

const taskStore = useTaskStore();

const days = computed(() => taskStore.topCreatedDays)

onMounted(() => {
    taskStore.getTopCreatedDays()
})

const dayMap: Record<string, string> = {
    Sun: "Domingo",
    Mon: "Lunes",
    Tue: "Martes",
    Wed: "Miércoles",
    Thu: "Jueves",
    Fri: "Viernes",
    Sat: "Sábado",
}

// Just add colors
const dayColorMap: Record<string, string> = {
    Sun: "bg-slate-100 text-slate-700 dark:bg-slate-950/30 dark:text-slate-300",
    Mon: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    Tue: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
    Wed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
    Thu: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    Fri: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300",
    Sat: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
}
</script>

<template>
    <GCard title="Dias con más tareas creadas">
        <div v-if="days.length === 0" class="text-center text-slate-400 py-10">
            No hay tareas creadas aún
        </div>

        <div v-else v-for="day in days" :key="day.day"
            class="p-4 rounded-lg flex gap-2 mb-4 items-center justify-between" :class="dayColorMap[day.day]">
            <h3 class="flex items-center gap-2">
                <Calendar class="w-5 h-5" />
                {{ dayMap[day.day] }}
            </h3>
            <p class="font-bold text-xl">{{ day.total }}</p>
        </div>
    </GCard>
</template>