export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export enum TaskStatus {
    PENDING = "pending",
    DONE = "done"
}

export interface TaskFilters {
    priority?: string
    status?: string
    title?: string
    dueDate?: string
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    priority: TaskPriority | "low" | "medium" | "high";
    status: TaskStatus;
    dueDate: Date | string;
    createdAt: Date;
    updatedAt: Date;
}