import React, { useState } from 'react';
import { Task, Client, TaskStatus, TaskPriority } from '../types';

interface EditTaskModalProps {
    task: Task;
    clients: Client[];
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, clients, onClose, onSave }) => {
    const [title, setTitle] = useState(task.title);
    const [clientId, setClientId] = useState(task.clientId);
    const [dueDate, setDueDate] = useState(new Date(task.dueDate).toISOString().split('T')[0]);
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dateParts = dueDate.split('-').map(part => parseInt(part, 10));
        const adjustedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        onSave({
            ...task,
            title,
            clientId,
            dueDate: adjustedDate,
            status,
            priority,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-lg shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700/50">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Editar Tarefa</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Título da Tarefa</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="clientId" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Cliente</label>
                            <select id="clientId" value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required>
                                 {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                        </div>
                        <div>
                           <label htmlFor="dueDate" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Data de Vencimento</label>
                           <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Status</label>
                            <select id="status" value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required>
                                 {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Prioridade</label>
                            <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" required>
                                 {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-md hover:from-primary-light hover:to-primary transition-all">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
};