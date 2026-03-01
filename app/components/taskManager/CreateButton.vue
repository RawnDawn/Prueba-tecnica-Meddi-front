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
import { Button } from '~/components/ui/button';
import { Separator } from "~/components/ui/separator";
import { Field, FieldGroup } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
// import { ref } from "vue";
import { taskSchema } from "~/schemas/taskSchema";

const formData = ref({
    title: "",
    description: "",
});

// errors
const errors = ref<{ [key: string]: string }>({});

// Submit
const handleSubmit = () => {
    errors.value = {};

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

                    <Field :data-invalid="errors.description">
                        <Label for="description">Descripción</Label>
                        <Textarea id="description" name="description" v-model="formData.description"
                            :aria-invalid="errors.description" :class="errors.description ? 'border-destructive' : ''" />

                        <FieldDescription v-if="errors.description" class="text-destructive text-sm ">
                            {{ errors.description }}
                        </FieldDescription> 
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>