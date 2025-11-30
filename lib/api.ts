import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    Task,
    CreateTaskDto,
    UpdateTaskDto,
} from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


class ApiService {
    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'An error occurred',
                statusCode: response.status,
            }));
            throw error;
        }
        return response.json();
    }

    // Auth endpoints
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return this.handleResponse<AuthResponse>(response);
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await this.handleResponse<AuthResponse>(response);

        // Store token in localStorage
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    // Task endpoints
    async getTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: this.getAuthHeader(),
        });
        return this.handleResponse<Task[]>(response);
    }

    async getTask(id: number): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            headers: this.getAuthHeader(),
        });
        return this.handleResponse<Task>(response);
    }

    async createTask(taskData: CreateTaskDto): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: this.getAuthHeader(),
            body: JSON.stringify(taskData),
        });
        return this.handleResponse<Task>(response);
    }

    async updateTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeader(),
            body: JSON.stringify(taskData),
        });
        return this.handleResponse<Task>(response);
    }

    async deleteTask(id: number): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeader(),
        });
        return this.handleResponse<{ message: string }>(response);
    }

    // Helper to check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }

    // Get current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export const apiService = new ApiService();
