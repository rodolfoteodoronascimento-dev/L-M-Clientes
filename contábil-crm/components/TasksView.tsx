
import React, { useState } from 'react';
import { Task, TaskStatus, Client, TaskPriority } from '../types';
import { EditTaskModal } from './EditTaskModal';
import { AddTaskModal } from './AddTaskModal';

interface TasksViewProps {
    tasks: Task[];
    clients: Client[];
    onSelectClient: (clientId: string) => void;
    updateTask: (updatedTask: Task) => void;
    addTask: (task: Omit<Task, 'id' | 'status'>) => void;
}

const statusStyles: Record<TaskStatus, string> = {
    [TaskStatus.ToDo]: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
    [TaskStatus.InProgress]: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
    [TaskStatus.Done]: "bg-green-500/10 text-green-500 dark:text-green-400",
};

const priorityStyles: Record<TaskPriority, string> = {
    [TaskPriority.High]: "bg-red-500/10 text-red-500 dark:text-red-400",
    [TaskPriority.Medium]: "bg-yellow-500/10 text-yellow-500 dark:text-yellow-400",
    [TaskPriority.Low]: "bg-zinc-600/10 text-zinc-500 dark:text-zinc-400",
};

export const TasksView: React.FC<TasksViewProps> = ({ tasks, clients, onSelectClient, updateTask, addTask }) => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.companyName || 'N/A';
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        // Sort by status first (Done at the bottom)
        if (a.status === TaskStatus.Done && b.status !== TaskStatus.Done) return 1;
        if (a.status !== TaskStatus.Done && b.status === TaskStatus.Done) return -1;

        // Then by priority
        const priorityOrder = { [TaskPriority.High]: 0, [TaskPriority.Medium]: 1, [TaskPriority.Low]: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Finally by due date
        return a.dueDate.getTime() - b.dueDate.getTime();
    });

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Fluxo de Trabalho</h3>
                    <p className="text-zinc-500 text-sm">Controle de entregas e obrigações fiscais.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2.5 bg-primary text-zinc-900 font-black rounded-xl hover:bg-primary-light transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Nova Demanda
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            <th className="pb-4 pt-0 w-12"></th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Obrigação</th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Empresa</th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Prazo</th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Prioridade</th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                            <th className="pb-4 pt-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right pr-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {sortedTasks.map((task) => {
                            const isDone = task.status === TaskStatus.Done;
                            const handleToggleDone = () => {
                                const newStatus = isDone ? TaskStatus.ToDo : TaskStatus.Done;
                                updateTask({ ...task, status: newStatus });
                            };
                            return (
                                <tr key={task.id} className={`group transition-all duration-150 ${isDone ? 'opacity-40 grayscale' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'}`}>
                                    <td className="py-5">
                                        <input
                                            type="checkbox"
                                            checked={isDone}
                                            onChange={handleToggleDone}
                                            className="h-5 w-5 rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-primary focus:ring-primary/40 transition-all cursor-pointer"
                                        />
                                    </td>
                                    <td className={`py-5 font-bold text-sm text-black dark:text-white ${isDone ? 'line-through' : ''}`}>{task.title}</td>
                                    <td className="py-5">
                                        <button onClick={() => onSelectClient(task.clientId)} className={`text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors ${isDone ? 'line-through' : ''}`}>
                                            {getClientName(task.clientId)}
                                        </button>
                                    </td>
                                    <td className={`py-5 text-xs font-medium text-zinc-500 dark:text-zinc-400 ${isDone ? 'line-through' : ''}`}>{task.dueDate.toLocaleDateString('pt-BR')}</td>
                                    <td className="py-5">
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${priorityStyles[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${statusStyles[task.status]}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-5 text-right pr-4">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingTask(task)} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-lg" aria-label="Editar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {editingTask && (
                <EditTaskModal 
                    task={editingTask}
                    clients={clients}
                    onClose={() => setEditingTask(null)}
                    onSave={updateTask}
                />
            )}
            {isAddModalOpen && (
                <AddTaskModal
                    clients={clients}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={addTask}
                />
            )}
        </div>
    );
};
