<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import { columns } from "~/components/taskManager/columns";
import TaskDataTable from "~/components/taskManager/TaskDataTable.vue";
import TaskDataTableByPriority from "~/components/taskManager/TaskDataTableByPriority.vue";
import { TaskPriority } from "~/types/task";

</script>

<template>
  <GPageContainer>

    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- CRUD -->
      <div class="mb-14">
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


  </GPageContainer>
</template>

<!-- TODO - remove date from calendar filter -->