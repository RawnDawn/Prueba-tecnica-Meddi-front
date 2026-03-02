<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{
    priority: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: Component;
}>()

</script>

<template>
    <Badge :variant="variant">
        {{ priority }}
        <component v-if="icon" :is="icon"/>
    </Badge>
</template>