<script setup lang="ts">
import { TaskPriority } from "~/types/task";
import DuePicker from "~/components/taskManager/DuePicker.vue";
import { Plus } from "lucide-vue-next";

const {
    open,
    formData,
    selectedPriority,
    dueDate,
    errors,
    apiError,
    handleSubmit
} = useCreateTaskForm()
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button variant="default" class="w-full lg:w-auto">
                <Plus /> Nueva tarea
            </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-sm">
            <form @submit.prevent="handleSubmit" novalidate>
                <DialogHeader class="mb-2">
                    <DialogTitle>Nueva tarea</DialogTitle>
                    <Separator />
                    <DialogDescription>
                        Llena el formulario para crear una nueva tarea.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup class="mb-5">
                    <!-- Title -->
                    <Field :data-invalid="errors.title">
                        <Label for="title">
                            Titulo <span class="text-destructive">*</span>
                        </Label>
                        <Input id="title" name="title" required v-model="formData.title" :aria-invalid="errors.title"
                            :class="errors.title ? 'border-destructive' : ''" />

                        <FieldDescription v-if="errors.title" class="text-destructive text-sm ">
                            {{ errors.title }}
                        </FieldDescription>
                    </Field>

                    <!-- Description -->
                    <Field :data-invalid="errors.description">
                        <Label for="description">Descripción</Label>
                        <Textarea id="description" name="description" v-model="formData.description"
                            :aria-invalid="errors.description"
                            :class="errors.description ? 'border-destructive' : ''" />

                        <FieldDescription v-if="errors.description" class="text-destructive text-sm ">
                            {{ errors.description }}
                        </FieldDescription>
                    </Field>

                    <!-- Prio -->
                    <Field :data-invalid="errors.priority">
                        <Label class="mb-3" for="priority">
                            Prioridad<span class="text-destructive">*</span>
                        </Label>

                        <Select default-value="medium"
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

                    <!-- Due date -->
                    <Field :data-invalid="errors.dueDate">
                        <Label for="dueDate">
                            Fecha de vencimiento test <span class="text-destructive">*</span>
                        </Label>

                        <DuePicker v-model="dueDate" />

                        <FieldDescription v-if="errors.dueDate" class="text-destructive text-sm ">
                            {{ errors.dueDate }}
                        </FieldDescription>
                    </Field>


                </FieldGroup>

                <!-- Api errors -->
                <div class="mb-5">
                    <Alert v-if="apiError" variant="destructive" :text="apiError" />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button as="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Guardar</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>