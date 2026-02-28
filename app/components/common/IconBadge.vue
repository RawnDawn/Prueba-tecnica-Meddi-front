<script setup lang="ts">
import { Badge } from "@/components/ui/badge"

const props = defineProps<{
    text: string,
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
}>()

</script>

<template>
    <div className="flex flex-wrap gap-2">
        <Badge :variant="variant">
            {{ text }}
            <slot />
        </Badge>
    </div>
</template>