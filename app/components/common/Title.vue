<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle?: string
}>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="text-muted-foreground">{{ subtitle }}</p>
    </div>
</template>