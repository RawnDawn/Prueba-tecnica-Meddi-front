<script setup lang="ts">
import Title from "~/components/common/Title.vue";
import IconBadge from "~/components/common/IconBadge.vue"
import { CircleX } from "lucide-vue-next";
import { columns } from "~/components/taskManager/columns";
import DataTable from "~/components/ui/data-table/data-table.vue";

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import {useTaskStore} from "~/stores/taskStore"
import App from "~/app.vue";

// const pinia = createPinia()
// const app = createApp(App)
// app.use(pinia)

const store = useTaskStore();
await store.fetchTasks();


// Test 1 - passed
// const data = ref<Task[]>([])

// onMounted(async () => {
//   const res = await fetch(`http://localhost:3080/tasks`)

//     const body = await res.json()

//     if (!res.ok) {
//         const errorCode = body.error as TaskErrorCode;

//         const message =
//             TASK_ERROR_MESSAGES[errorCode] ??
//             DEFAULT_ERROR_MESSAGE;

//         throw new Error(message);
//     }

//     data.value = body.data
// })

</script>

<template>
  <GPageContainer>
    <div class="flex flex-col gap-6">

      <Title title="Administrador de tareas" subtitle="Agrega y organiza tus tareas en un solo lugar." />

      <!-- Error -->
      <IconBadge v-if="store.error" :text="store.error" variant="destructive">
        <CircleX data-icon="inline-end" />
      </IconBadge>

      <div class="flex justify-end">
        <CreateButton />
      </div>

      <!-- Table -->
      <DataTable :columns="columns" :data="store.tasks" />
      <!-- <DataTable :columns="columns" :data="data" /> -->
    </div>

  </GPageContainer>
</template>

<!-- TODO - See if pinia don't fuck up again -->
 <!-- TODO - Manage validation errors when you close the dialog -->
  <!-- TODO - Add loading state when creating task (disable button) -->
   <!-- TODO - Close dialog and check logic to refresh tasks -->