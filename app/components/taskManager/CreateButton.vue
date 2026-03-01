<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Field, FieldDescription, FieldGroup } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ref } from "vue";
import { taskSchema } from "~/schemas/taskSchema";
import { Textarea } from "~/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { TaskPriority } from "~/types/task";

const formData = ref({
    title: "",
    description: "",
    priority: "",
    testSelect: ""
});

// pivot to set and send prio to formData
const selectedPriority = ref<TaskPriority | "">("");

// errors
const errors = ref<{ [key: string]: string }>({});

// Submit
const handleSubmit = () => {
    errors.value = {};

    // add priority 
    formData.value.priority = selectedPriority.value;

    // Validate form
    const result = taskSchema.safeParse(formData.value);

    // Handle validation errors
    if (!result.success) {
        // For each error, show the message
        result.error.issues.forEach((issue) => {
            const key = issue.path[0] as string;
            errors.value[key] = issue.message;
        });
        return;
    }

    console.log("Formulario válido!", result.data);
};
</script>

<template>
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Nueva tarea</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
            <form @submit.prevent="handleSubmit" novalidate>
                <DialogHeader class="mb-2">
                    <DialogTitle>Nueva tarea</DialogTitle>
                    <Separator />
                </DialogHeader>

                <FieldGroup class="mb-5">
                    <!-- Title -->
                    <Field :data-invalid="errors.title">
                        <Label for="title">
                            Titulo <span className="text-destructive">*</span>
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
                            Prioridad<span className="text-destructive">*</span>
                        </Label>

                        <Select  @update:model-value="(value) => selectedPriority = value as TaskPriority">
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

                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button as="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>