<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX } from "lucide-vue-next";
import { columns } from "~/components/taskManager/columns";
import DataTable from "~/components/taskManager/DataTable.vue";

// import { useTaskStore } from "~/stores/taskStore"

// const store = useTaskStore();
// await store.fetchTasks();

</script>

<template>
  <GPageContainer>

    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- CRUD -->
      <DataTable :columns="columns" />


      <!-- Per prio -->
      <!-- <div class="grid grid-cols-3">
        <DataTable :columns="columns" :data="store.tasks" />
        <DataTable :columns="columns" :data="store.tasks" />
        <DataTable :columns="columns" :data="store.tasks" />
  
      </div> -->
    </div>


  </GPageContainer>
</template>

<!-- TODO - remove date from calendar filter -->