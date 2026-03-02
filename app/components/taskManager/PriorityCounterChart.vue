<script setup lang="ts">
import type {
    ChartConfig,
} from "@/components/ui/chart"

import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer } from "@unovis/vue"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    componentToString,
} from "@/components/ui/chart"
import { TaskPriority } from "~/types/task"
import { useTaskStore } from "#imports"
import { Circle } from "lucide-vue-next"

const store = useTaskStore();
await store.getPriorityCount();

const chartData = [
    { priority: TaskPriority.LOW, count: store.priorityCount.low ?? 0, fill: "#fff"},
    { priority: TaskPriority.MEDIUM, count: store.priorityCount.medium ?? 0, fill: "#1d9df0" },
    { priority: TaskPriority.HIGH, count: store.priorityCount.high ?? 0, fill: "#9b1f26" },
]
type Data = typeof chartData[number]

const chartConfig = {
    count: {
        label: "Tareas",
        color: undefined,
    },
    [TaskPriority.LOW]: {
        label: "Baja",
        color: "#fff",
    },
    [TaskPriority.MEDIUM]: {
        label: "Media",
        color: "#1d9df0",
    },
    [TaskPriority.HIGH]: {
        label: "Alta",
        color: "#9b1f26",
    },
} satisfies ChartConfig
</script>

<template>
    <Card class="flex flex-col">
        <CardHeader class="items-center pb-0">
            <CardTitle>Tareas por prioridad</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 pb-0">
            <ChartContainer :config="chartConfig" class="mx-auto aspect-square max-h-[250px]">
                <VisSingleContainer :data="chartData" :margin="{ top: 30, bottom: 30 }">
                    <VisDonut :value="(d: Data) => d.count"
                        :color="(d: Data) => chartConfig[d.priority as keyof typeof chartConfig].color"
                        :arc-width="30" />
                    <ChartTooltip :triggers="{
                        [Donut.selectors.segment]: componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })!,
                    }" />
                </VisSingleContainer>
            </ChartContainer>
        </CardContent>
        <CardFooter class="flex flex-row items-center justify-center gap-2 text-sm">
            <div class="flex items-center gap-2 font-medium leading-none">
                <Circle class="text-white fill-white" />Baja
            </div>
            <div class="flex items-center gap-2 font-medium leading-none">
                <Circle class="text-blue-500 fill-blue-500" />Media
            </div>
            <div class="flex items-center gap-2 font-medium leading-none">
                <Circle class="text-red-800 fill-red-800" />Alta
            </div>
        </CardFooter>
    </Card>
</template>
