<script setup lang="ts">
import {
    Alert,
    AlertDescription,
} from "~/components/ui/alert"
import { InfoIcon } from "lucide-vue-next"

defineProps<{
    text: string
    variant: "destructive" | "default"
}>()
</script>

<template>
    <Alert :variant="variant">
        <InfoIcon />
        <AlertDescription>
            {{ text }}
        </AlertDescription>
    </Alert>
</template>