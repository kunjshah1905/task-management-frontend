'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskDto } from '@/types/task';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['To Do', 'In Progress', 'Completed']),
    dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateTaskDto) => void;
    task?: Task | null;
    isLoading?: boolean;
}

export function TaskDialog({ open, onOpenChange, onSubmit, task, isLoading }: TaskDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'To Do',
            dueDate: '',
        },
    });

    const selectedStatus = watch('status');

    useEffect(() => {
        if (task) {
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('status', task.status);
            setValue('dueDate', task.dueDate.split('T')[0]);
        } else {
            reset({
                title: '',
                description: '',
                status: 'To Do',
                dueDate: '',
            });
        }
    }, [task, setValue, reset]);

    const handleFormSubmit = (data: TaskFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                    <DialogDescription>
                        {task
                            ? 'Update the details of your task below.'
                            : 'Fill in the details to create a new task.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter task title"
                            {...register('title')}
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter task description"
                            rows={4}
                            {...register('description')}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setValue('status', value as TaskStatus)}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="To Do">To Do</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                {...register('dueDate')}
                                className={errors.dueDate ? 'border-destructive' : ''}
                            />
                            {errors.dueDate && (
                                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
