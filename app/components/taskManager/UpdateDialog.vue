<script setup lang="ts">
import { TaskPriority, TaskStatus } from '~/types/task'
import DuePicker from '~/components/taskManager/DuePicker.vue'
import Alert from '~/components/common/Alert.vue'

const props = defineProps<{
    id: string
    open: boolean
}>()

const taskIdRef = ref(props.id)
watch(() => props.id, val => taskIdRef.value = val)

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const {
    formData,
    selectedPriority,
    selectedStatus,
    dueDate,
    errors,
    apiError,
    localOpen,
    handleSubmit
} = useUpdateTaskForm(taskIdRef, props.open)

// Sync localOpen with parent
watch(localOpen, val => emit('update:open', val))
watch(() => props.open, val => localOpen.value = val)
</script>

<template>
    <Dialog v-model:open="localOpen">
        <slot name="trigger" :openDialog="() => emit('update:open', true)" />

        <DialogContent @keydown.esc="emit('update:open', false)" class="sm:max-w-sm">
            <form @submit.prevent="handleSubmit" novalidate>
                <DialogHeader class="mb-2">
                    <DialogTitle>Actualizar tarea</DialogTitle>
                    <Separator />
                    <DialogDescription>
                        Llena el formulario para actualizar una tarea existente.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup class="mb-5">
                    <!-- Title -->
                    <Field :data-invalid="errors.title">
                        <Label for="title">Titulo <span class="text-destructive">*</span></Label>
                        <Input id="title" v-model="formData.title" :class="errors.title ? 'border-destructive' : ''" />
                        <FieldDescription v-if="errors.title" class="text-destructive text-sm">
                            {{ errors.title }}
                        </FieldDescription>
                    </Field>

                    <!-- description -->
                    <Field :data-invalid="errors.description">
                        <Label for="description">Descripción</Label>
                        <Textarea id="description" v-model="formData.description"
                            :class="errors.description ? 'border-destructive' : ''" />
                        <FieldDescription v-if="errors.description" class="text-destructive text-sm">
                            {{ errors.description }}
                        </FieldDescription>
                    </Field>

                    <!-- prio -->
                    <Field :data-invalid="errors.priority">
                        <Label class="mb-3">Prioridad <span class="text-destructive">*</span></Label>
                        <Select :key="formData.priority" :default-value="selectedPriority"
                            @update:model-value="(value) => selectedPriority = value as TaskPriority">
                            <SelectTrigger :aria-invalid="errors.priority">
                                <SelectValue placeholder="Selecciona la prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="low" class="text-green-500">Baja</SelectItem>
                                    <SelectItem value="medium" class="text-yellow-500">Media</SelectItem>
                                    <SelectItem value="high" class="text-destructive">Alta</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription v-if="errors.priority" class="text-destructive text-sm">
                            {{ errors.priority }}
                        </FieldDescription>
                    </Field>

                    <!-- status -->
                    <Field :data-invalid="errors.status">
                        <Label class="mb-3">Estado <span class="text-destructive">*</span></Label>
                        <Select :key="formData.status" :default-value="selectedStatus"
                            @update:model-value="(value) => selectedStatus = value as TaskStatus">
                            <SelectTrigger :aria-invalid="errors.status">
                                <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="done" class="text-green-500">Completada</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription v-if="errors.status" class="text-destructive text-sm">
                            {{ errors.status }}
                        </FieldDescription>
                    </Field>

                    <!-- Due date -->
                    <Field :data-invalid="errors.dueDate">
                        <Label>Fecha de vencimiento</Label>
                        <DuePicker v-model="dueDate" />
                        <FieldDescription v-if="errors.dueDate" class="text-destructive text-sm">
                            {{ errors.dueDate }}
                        </FieldDescription>
                    </Field>
                </FieldGroup>

                <!-- api errors -->
                <div class="mb-5">
                    <Alert v-if="apiError" variant="destructive" :text="apiError" />
                </div>

                <DialogFooter>
                    <DialogClose asChild v-on:click="emit('update:open', false)">
                        <Button v-on:click="emit('update:open', false)" as="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>