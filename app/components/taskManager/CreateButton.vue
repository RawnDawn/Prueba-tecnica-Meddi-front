<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
import { useTaskStore } from "~/stores/taskStore"
import DuePicker from "~/components/taskManager/DuePicker.vue";

const store = useTaskStore();

const formData = ref({
    title: "",
    description: "",
    priority: "",
    dueDate: ""
});

// pivot to set and send prio to formData
const selectedPriority = ref<TaskPriority | "low" | "medium" | "high">("medium");

// Get due date from picker
const dueDate = ref<string>("");

// errors
const errors = ref<{ [key: string]: string }>({});

// Submit
const handleSubmit = async () => {
    errors.value = {};

    // add priority and dueDate
    formData.value.priority = selectedPriority.value;
    formData.value.dueDate = dueDate.value;

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

    console.log(result.data);

    // try {
    //     await store.createTask(result.data);
    // } catch (error) {
    //     console.error("Error: ", error);
    // }
};

/**
 * Manage dialog open state
 */
const open = ref(false)

/**
 * Clean form when submit or close dialog
 */
const resetForm = () => {
    formData.value = {
        title: "",
        description: "",
        priority: "",
        dueDate: ""
    }

    selectedPriority.value = "medium"
    dueDate.value = ""
    errors.value = {}
}

watch(open, (val) => {
    if (!val) resetForm()
})
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button variant="outline">Nueva tarea</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
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
                    <!-- <Field :data-invalid="errors.dueDate">
                        <Label for="dueDate">
                            Fecha de vencimiento <span className="text-destructive">*</span>
                        </Label>
                        <Input id="dueDate" name="dueDate" required v-model="formData.dueDate"
                            :aria-invalid="errors.dueDate" :class="errors.dueDate ? 'border-destructive' : ''" />

                        <FieldDescription v-if="errors.dueDate" class="text-destructive text-sm ">
                            {{ errors.dueDate }}
                        </FieldDescription>
                    </Field> -->

                    <!-- Due date -->
                    <Field :data-invalid="errors.dueDate">
                        <Label for="dueDate">
                            Fecha de vencimiento test <span className="text-destructive">*</span>
                        </Label>

                        <DuePicker v-model="dueDate" />

                        <FieldDescription v-if="errors.dueDate" class="text-destructive text-sm ">
                            {{ errors.dueDate }}
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