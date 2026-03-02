<script setup lang="ts">
import type {
    ChartConfig,
} from "@/components/ui/chart"

import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer } from "@unovis/vue"
import { ChartTooltipContent, componentToString } from "@/components/ui/chart"
import { TaskStatus } from "~/types/task"
import { useTaskStore } from "~/stores/taskStore"
import { Circle } from "lucide-vue-next"

const store = useTaskStore();

await store.getStatusCount();

const chartData = computed(() => [
    { status: TaskStatus.PENDING, count: store.statusCount.pending ?? 0, fill: "#fff" },
    { status: TaskStatus.DONE, count: store.statusCount.done ?? 0, fill: "#1d9df0" },
])
type Data = typeof chartData.value[number]

const chartConfig = {
    count: {
        label: "Tareas",
        color: undefined,
    },
    [TaskStatus.PENDING]: {
        label: "Pendiente",
        color: "#fff",
    },
    [TaskStatus.DONE]: {
        label: "Completada",
        color: "#1d9df0",
    },
} satisfies ChartConfig
</script>

<template>
    <Card class="flex flex-col">
        <CardHeader class="items-center pb-0">
            <CardTitle>Tareas por estado</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 pb-0">
            <ChartContainer :config="chartConfig" class="mx-auto aspect-square max-h-[250px]">
                <VisSingleContainer :data="chartData" :margin="{ top: 30, bottom: 30 }">
                    <VisDonut :value="(d: Data) => d.count"
                        :color="(d: Data) => chartConfig[d.status as keyof typeof chartConfig].color" :arc-width="30" />
                    <ChartTooltip :triggers="{
                        [Donut.selectors.segment]: componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })!,
                    }" />
                </VisSingleContainer>
            </ChartContainer>
        </CardContent>
        <CardFooter class="flex flex-row items-center justify-center gap-2 text-sm">
            <div class="flex items-center gap-2 font-medium leading-none">
                <Circle class="text-white fill-white" />Pendiente
            </div>
            <div class="flex items-center gap-2 font-medium leading-none">
                <Circle class="text-blue-500 fill-blue-500" />Completada
            </div>
        </CardFooter>
    </Card>
</template>
