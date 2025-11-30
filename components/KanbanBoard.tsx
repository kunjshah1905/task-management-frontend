'use client';

import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DndContext, DragEndEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface KanbanBoardProps {
    tasks: Task[];
    onTaskMove: (taskId: number, newStatus: TaskStatus) => void;
    onTaskEdit: (task: Task) => void;
    onTaskDelete: (id: number) => void;
}

const statusConfig: Record<TaskStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
    'To Do': {
        icon: <Circle className="h-5 w-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    'In Progress': {
        icon: <Clock className="h-5 w-5" />,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
    'Completed': {
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
};

export function KanbanBoard({ tasks, onTaskMove, onTaskEdit, onTaskDelete }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = tasks.find((t) => t.id === active.id);
        const overStatus = over.id as TaskStatus;

        if (activeTask && activeTask.status !== overStatus) {
            onTaskMove(activeTask.id, overStatus);
        }

        setActiveId(null);
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter((task) => task.status === status);
    };

    const activeTask = tasks.find((t) => t.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(statusConfig) as TaskStatus[]).map((status) => {
                    const statusTasks = getTasksByStatus(status);
                    const config = statusConfig[status];

                    return (
                        <SortableContext
                            key={status}
                            id={status}
                            items={statusTasks.map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                            >
                                <Card className={`flex-1 ${config.bgColor} border-2`}>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className={`text-lg font-bold flex items-center gap-2 ${config.color}`}>
                                                {config.icon}
                                                {status}
                                            </CardTitle>
                                            <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                                                {statusTasks.length}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 min-h-[200px]">
                                        {statusTasks.length === 0 ? (
                                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                                No tasks
                                            </div>
                                        ) : (
                                            statusTasks.map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onEdit={onTaskEdit}
                                                    onDelete={onTaskDelete}
                                                />
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </SortableContext>
                    );
                })}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-3 opacity-80">
                        <TaskCard
                            task={activeTask}
                            onEdit={() => { }}
                            onDelete={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
