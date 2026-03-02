<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import { columns } from "~/components/taskManager/columns";
import TaskDataTable from "~/components/taskManager/TaskDataTable.vue";
import TaskDataTableByPriority from "~/components/taskManager/TaskDataTableByPriority.vue";
import { TaskPriority } from "~/types/task";
import PriorityCounterChart from "~/components/taskManager/PriorityCounterChart.vue";
import StatusCounterChart from "~/components/taskManager/StatusCounterChart.vue"
import MoreCreatedTask from "~/components/taskManager/MoreCreatedTask.vue";
import MoreCompletedTask from "~/components/taskManager/MoreCompletedTask.vue";
</script>

<template>
  <GPageContainer>

    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <div class="grid grid-cols-1 gap-20">
        <!-- KPIs -->
        <div class="grid xl:grid-cols-4 gap-4">
          <!-- Chart task per prio -->
          <PriorityCounterChart />

          <!-- Chart task per state -->
          <StatusCounterChart />

          <!-- 3 days with more CREATED tasks -->
          <MoreCreatedTask />

          <!-- 3 days with more COMPLETED tasks -->
          <MoreCompletedTask />
        </div>

        <!-- CRUD -->
        <div>
          <TaskDataTable :columns="columns" />
        </div>

        <!-- Per prio -->
        <div class="grid grid-cols-1 gap-10 xl:grid-cols-3">
          <div>
            <h1 class="text-xl font-bold tracking-tight mb-4">Prioridad Alta</h1>
            <TaskDataTableByPriority :priority="TaskPriority.HIGH" />
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight mb-4">Prioridad Media</h1>
            <TaskDataTableByPriority :priority="TaskPriority.MEDIUM" />
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight mb-4">Prioridad Baja</h1>
            <TaskDataTableByPriority :priority="TaskPriority.LOW" />
          </div>
        </div>
      </div>
    </div>

  </GPageContainer>
</template>