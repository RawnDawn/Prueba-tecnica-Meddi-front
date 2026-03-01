<script setup lang="ts">
import Badge from '~/components/ui/badge/Badge.vue';

defineProps<{
    task: {
        _id: string
    };
    status: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}>()
</script>

<template>
    <Badge :variant="variant">
        <button>
            {{ status }}
        </button>
    </Badge>
</template>