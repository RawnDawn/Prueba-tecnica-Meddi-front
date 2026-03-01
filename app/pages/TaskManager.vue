<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useTaskStore } from "~/stores/taskStore";
import { Spinner } from "@/components/ui/spinner"

import type { Task } from "~/types/task";

import Title from "~/components/common/Title.vue";
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX } from "lucide-vue-next";

import { columns } from "~/components/taskManager/columns";
import DataTable from "~/components/ui/data-table/data-table.vue";

const taskStore = useTaskStore();
const data = ref<Task[]>([])

onMounted(async () => {
  await taskStore.fetchTasks()
  data.value = taskStore.tasks
})

</script>

<template>
  <GPageContainer>
    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- Loading -->
      <!-- <IconBadge v-if="taskStore.loading" text="Cargando tareas" variant="outline">
        <Spinner data-icon="inline-end" />
      </IconBadge> -->

      <!-- Error -->
      <!-- <IconBadge v-if="taskStore.error" :text="taskStore.error" variant="destructive">
        <CircleX data-icon="inline-end" />
      </IconBadge> -->

      <div class="flex justify-end">
        <CreateButton />
      </div>

      <!-- Table -->
      <DataTable :columns="columns" :data="data" />
    </div>

  </GPageContainer>
</template>
