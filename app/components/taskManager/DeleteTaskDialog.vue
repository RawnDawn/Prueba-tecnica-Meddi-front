<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { ref, watch } from 'vue'
import { useTaskStore } from '~/stores/taskStore'

const props = defineProps<{
    id: string
    open: boolean
}>()

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const store = useTaskStore()

// Manage dialog closing with on top close button
const localOpen = ref(props.open)

// sync localOpen with props.open
watch(() => props.open, val => {
    localOpen.value = val
})

// sync props.open with localOpen
watch(localOpen, val => {
    emit('update:open', val)
})
</script>

<template>
    <Dialog v-model:open="localOpen">
        <slot name="trigger" :openDialog="() => emit('update:open', true)" />

        <DialogContent @keydown.esc="emit('update:open', false)" class="sm:max-w-sm">
            <DialogHeader class="mb-2">
                <DialogTitle class="text-destructive ">Eliminar tarea</DialogTitle>
                <Separator />
                <DialogDescription>
                    Llena el formulario para actualizar una tarea existente.
                </DialogDescription>
            </DialogHeader>


            <DialogFooter>
                <DialogClose asChild v-on:click="emit('update:open', false)">
                    <Button v-on:click="emit('update:open', false)" as="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>