export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export enum TaskStatus {
    PENDING = "pending",
    DONE = "done"
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}