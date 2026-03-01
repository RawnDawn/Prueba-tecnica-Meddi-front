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
import { taskUpdateSchema } from "~/schemas/taskSchema";
import { Textarea } from "~/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { TaskPriority, TaskStatus, type Task } from "~/types/task";
import { useTaskStore } from "~/stores/taskStore"
import DuePicker from "~/components/taskManager/DuePicker.vue";
import Alert from "../common/Alert.vue";
import { getTaskErrorMessage } from "~/lib/taskErrorMapper";


const props = defineProps<{
    id: string,
}>()

const store = useTaskStore();

const formData = ref({
    title: "",
    description: "",
    priority: "",
    status: "",
    dueDate: ""
});

/**
 * Manage dialog open state
 */
const open = ref(false)
const openDialog = () => (open.value = true)

// pivot to set and send prio to formData
const selectedPriority = ref<TaskPriority | "low" | "medium" | "high">("medium");

// pivot to set and send status to formData
const selectedStatus = ref<TaskStatus | "pending" | "done">("pending");

// Get due date from picker
const dueDate = ref<string>("");

// errors
const errors = ref<{ [key: string]: string }>({});
const apiError = ref<string>("");

// Submit
const handleSubmit = async () => {
    errors.value = {};

    // add priority and dueDate
    formData.value.priority = selectedPriority.value;
    formData.value.status = selectedStatus.value;
    formData.value.dueDate = dueDate.value;

    // Validate form
    const result = taskUpdateSchema.safeParse(formData.value);

    // Handle validation errors
    if (!result.success) {
        // For each error, show the message
        result.error.issues.forEach((issue) => {
            const key = issue.path[0] as string;
            errors.value[key] = issue.message;
        });
        return;
    }

    try {
        // Here we need to cast the priority to the correct type
        await store.updateTask(props.id, {
            ...result.data,
            priority: result.data.priority as TaskPriority,
            status: result.data.status as TaskStatus
        });

        await store.fetchTasks();

        // Close dialog
        open.value = false;
    } catch (error) {
        apiError.value = getTaskErrorMessage(error)
    }
};

// Set default values
watchEffect(async () => {
    const task = await store.showTask(props.id)

    if (task) {
        formData.value = {
            title: task.title || "",
            description: task.description || "",
            priority: task.priority as TaskPriority,
            status: task.status as TaskStatus,
            dueDate: task.dueDate || ""
        }
        selectedPriority.value = task.priority as TaskPriority;
        selectedStatus.value = task.status as TaskStatus;
        dueDate.value = task.dueDate || "";
    }
})

/**
 * Clean form when submit or close dialog
 */
const resetForm = () => {
    errors.value = {}
}

watch(open, (val) => {
    if (!val) resetForm()
})
</script>

<template>
    <Dialog v-model:open="open">
        <slot name="trigger" :openDialog="openDialog" />

        <DialogContent className="sm:max-w-sm">
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

                        <Select :default-value="selectedPriority"
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

                    <!-- Status -->
                    <Field :data-invalid="errors.status">
                        <Label class="mb-3" for="status">
                            Estado<span className="text-destructive">*</span>
                        </Label>

                        <Select :default-value="selectedStatus"
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
                        <Label for="dueDate">
                            Fecha de vencimiento test <span className="text-destructive">*</span>
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
                    <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>