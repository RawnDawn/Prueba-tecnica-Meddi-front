<script setup lang="ts">
import { onMounted } from "vue"
import { useTaskStore } from "~/stores/taskStore";
import { Spinner } from "@/components/ui/spinner"

import Title from "~/components/common/Title.vue";
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX } from "lucide-vue-next";
const taskStore = useTaskStore();

onMounted(() => {
  taskStore.fetchTasks()
})

</script>

<template>
  <GPageContainer>
    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- Loading -->
      <IconBadge v-if="taskStore.loading" text="Cargando tareas" variant="outline">
        <Spinner data-icon="inline-end" />
      </IconBadge>

      <!-- Error -->
      <IconBadge v-if="taskStore.error" :text="taskStore.error" variant="destructive">
        <CircleX data-icon="inline-end" />
      </IconBadge>
    </div>

    <!-- <Table v-if="!taskStore.loading && !taskStore.error">
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-for="task in taskStore.tasks" :key="task._id">
          <TableCell>{{ task.title }}</TableCell>
        </TableRow>
      </TableBody>
    </Table> -->
  </GPageContainer>
</template>
