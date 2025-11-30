'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskDialog } from '@/components/TaskDialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks, createTask, updateTask, deleteTask, moveTask } from '@/store/taskSlice';
import { logout } from '@/store/authSlice';
import { apiService } from '@/lib/api';
import { Task, TaskStatus, CreateTaskDto } from '@/types/task';
import { motion } from 'framer-motion';
import { Plus, LogOut, Loader2 } from 'lucide-react';

export default function TasksPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);
    const { user } = useAppSelector((state) => state.auth);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!apiService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Fetch tasks
        dispatch(fetchTasks());
    }, [dispatch, router]);

    const handleCreateTask = async (data: CreateTaskDto) => {
        setIsSubmitting(true);
        try {
            await dispatch(createTask(data)).unwrap();
            toast({
                title: 'Success!',
                description: 'Task created successfully.',
            });
            setIsDialogOpen(false);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create task.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTask = async (data: CreateTaskDto) => {
        if (!editingTask) return;

        setIsSubmitting(true);
        try {
            await dispatch(updateTask({ id: editingTask.id, data })).unwrap();
            toast({
                title: 'Success!',
                description: 'Task updated successfully.',
            });
            setIsDialogOpen(false);
            setEditingTask(null);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update task.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await dispatch(deleteTask(id)).unwrap();
            toast({
                title: 'Success!',
                description: 'Task deleted successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete task.',
                variant: 'destructive',
            });
        }
    };

    const handleTaskMove = async (taskId: number, newStatus: TaskStatus) => {
        // Optimistic update
        dispatch(moveTask({ taskId, newStatus }));

        try {
            await dispatch(updateTask({ id: taskId, data: { status: newStatus } })).unwrap();

        } catch (error: any) {
            // Revert on error
            dispatch(fetchTasks());
            toast({
                title: 'Error',
                description: error.message || 'Failed to update task status.',
                variant: 'destructive',
            });
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    const handleLogout = () => {
        apiService.logout();
        dispatch(logout());
        router.push('/login');
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingTask(null);
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Task Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {user?.email || 'User'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="gradient-primary font-semibold"
                            size="lg"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            New Task
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="lg"
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">To Do</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                            {tasks.filter((t) => t.status === 'To Do').length}
                        </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">In Progress</p>
                        <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                            {tasks.filter((t) => t.status === 'In Progress').length}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                            {tasks.filter((t) => t.status === 'Completed').length}
                        </p>
                    </div>
                </motion.div>

                {/* Kanban Board */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <KanbanBoard
                        tasks={tasks}
                        onTaskMove={handleTaskMove}
                        onTaskEdit={handleEditTask}
                        onTaskDelete={handleDeleteTask}
                    />
                </motion.div>

                {/* Task Dialog */}
                <TaskDialog
                    open={isDialogOpen}
                    onOpenChange={handleDialogClose}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    task={editingTask}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}
