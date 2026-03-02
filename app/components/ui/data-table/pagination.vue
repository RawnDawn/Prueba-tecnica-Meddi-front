<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button"

defineProps<{
    disabledPreview: boolean
    disabledNext: boolean
    page: number
    totalPages: number
    onClickPrev: (page: number) => void
    onClickNext: (page: number) => void
}>()
</script>

<template>
    <div class="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button class="w-11 h-11 rounded-full" variant="outline" :disabled="disabledPreview" @click="onClickPrev">
            <ChevronLeft />
        </Button>

        <span>Página {{ page }} de {{ totalPages }}</span>

        <Button class="w-11 h-11 rounded-full" variant="outline" :disabled="disabledNext" @click="onClickNext">
            <ChevronRight />
        </Button>
    </div>
</template>