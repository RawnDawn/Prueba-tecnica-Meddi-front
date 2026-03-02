<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import { columns } from "~/components/taskManager/columns";
import TaskTable from "~/components/taskManager/TaskTable.vue";
import TableByPriority from "~/components/taskManager/TableByPriority.vue";
import { TaskPriority } from "~/types/task";
import PriorityCounterChart from "~/components/taskManager/PriorityCounterChart.vue";
import StatusCounterChart from "~/components/taskManager/StatusCounterChart.vue"
import TopCreatedTask from "~/components/taskManager/TopCreatedTask.vue";
import TopCompletedTask from "~/components/taskManager/TopCompletedTask.vue";
import { Separator } from "~/components/ui/separator";
</script>

<template>
  <GPageContainer>

    <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <!-- Tables -->
      <div class="xl:col-span-8">
        <TaskTable :columns="columns" />

        <Separator class="my-10" />

        <div class="grid grid-cols-1 gap-5">
          <Title title="Tareas por prioridad" subtitle="Consulta tus tareas separadas por prioridad." />
          <div>
            <h2 class="text-xl font-bold tracking-tight mb-4">Prioridad Alta</h2>
            <TableByPriority :priority="TaskPriority.HIGH" />
          </div>
          <div>
            <h2 class="text-xl font-bold tracking-tight mb-4">Prioridad Media</h2>
            <TableByPriority :priority="TaskPriority.MEDIUM" />
          </div>
          <div>
            <h2 class="text-xl font-bold tracking-tight mb-4">Prioridad Baja</h2>
            <TableByPriority :priority="TaskPriority.LOW" />
          </div>
        </div>
      </div>

      <!-- charts/kpis -->
      <div class="xl:col-span-4">
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <!-- Chart task per prio -->
          <PriorityCounterChart class="md:col-span-1 xl:col-span-2" />

          <!-- Chart task per state -->
          <StatusCounterChart class="md:col-span-1 xl:col-span-2" />

          <!-- 3 days with more CREATED tasks -->
          <TopCreatedTask class="md:col-span-1 xl:col-span-4" />

          <!-- 3 days with more COMPLETED tasks -->
          <TopCompletedTask class="md:col-span-1 xl:col-span-4" />
        </div>
      </div>
    </div>

  </GPageContainer>
</template>