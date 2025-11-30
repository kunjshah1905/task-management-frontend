import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/lib/api';
import {
    Task,
    CreateTaskDto,
    UpdateTaskDto,
    TaskStatus,
} from '@/types/task';

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    return await apiService.getTasks();
});

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: CreateTaskDto) => {
        return await apiService.createTask(taskData);
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }: { id: number; data: UpdateTaskDto }) => {
        return await apiService.updateTask(id, data);
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: number) => {
        await apiService.deleteTask(id);
        return id;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Optimistic update for drag and drop
        moveTask: (
            state,
            action: PayloadAction<{ taskId: number; newStatus: TaskStatus }>
        ) => {
            const task = state.tasks.find((t) => t.id === action.payload.taskId);
            if (task) {
                task.status = action.payload.newStatus;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create task';
            })
            // Update task
            .addCase(updateTask.pending, (state) => {
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update task';
            })
            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete task';
            });
    },
});

export const { moveTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
