<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX } from "lucide-vue-next";
import { columns } from "~/components/taskManager/columns";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { Button } from "~/components/ui/button";

import { useTaskStore } from "~/stores/taskStore"
import CreateDialog from "~/components/taskManager/CreateDialog.vue";

const store = useTaskStore();
await store.fetchTasks();

</script>

<template>
  <GPageContainer>
    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- Loading -->
      <!-- <IconBadge v-if="store.loading" text="Cargando tareas" variant="outline">
        <Spinner data-icon="inline-end" />
      </IconBadge> -->

      <!-- Error -->
      <IconBadge v-if="store.error" :text="store.error" variant="destructive">
        <CircleX data-icon="inline-end" />
      </IconBadge>

      <div class="flex justify-end">
        <CreateDialog />
      </div>

      <!-- Table -->
      <DataTable :columns="columns" :data="store.tasks" />

      <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button variant="outline" :disabled="store.page === 1 || store.loading"
          @click="store.fetchTasks(store.page - 1)">
          Anterior
        </Button>

        <span>Página {{ store.page }} de {{ store.totalPages }}</span>

        <Button variant="outline" :disabled="store.page === store.totalPages || store.loading"
          @click="store.fetchTasks(store.page + 1)">
          Siguiente
        </Button>
      </div>
    </div>

  </GPageContainer>
</template>
