<script setup lang="ts">
import type { Component } from 'vue';
import Badge from '~/components/ui/badge/Badge.vue';

defineProps<{
    status: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: Component
}>()
</script>

<template>
    <Badge :variant="variant">
        {{ status }}
        <component v-if="icon" :is="icon"  />
    </Badge>
</template>