// User types
export interface User {
    id: number;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

// Task types
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
}

// API Error types
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
