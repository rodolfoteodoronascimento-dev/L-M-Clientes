import React, { useState, useEffect } from 'react';
import { ProcessModel, TaskTemplate, ProcessFrequency } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ProcessModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (model: Omit<ProcessModel, 'id'> | ProcessModel) => void;
    modelToEdit: ProcessModel | null;
}

const inputStyles = "w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:ring-gold focus:border-gold bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white";

export const ProcessModelModal: React.FC<ProcessModelModalProps> = ({ isOpen, onClose, onSave, modelToEdit }) => {
    const isEditing = modelToEdit !== null;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<ProcessFrequency>(ProcessFrequency.Monthly);
    const [tasks, setTasks] = useState<TaskTemplate[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && modelToEdit) {
                setName(modelToEdit.name);
                setDescription(modelToEdit.description || '');
                setFrequency(modelToEdit.frequency);
                setTasks(modelToEdit.tasks.map(t => ({...t}))); // Create a copy to avoid direct mutation
            } else {
                setName('');
                setDescription('');
                setFrequency(ProcessFrequency.Monthly);
                setTasks([]);
            }
        }
    }, [isOpen, modelToEdit, isEditing]);
    
    const handleTaskChange = (index: number, field: keyof Omit<TaskTemplate, 'id'>, value: string | number) => {
        const newTasks = [...tasks];
        (newTasks[index] as any)[field] = value;
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        setTasks([...tasks, { id: uuidv4(), title: '', dueDayOffset: 1 }]);
    };

    const handleRemoveTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const modelData = { name, description, frequency, tasks };
        if (isEditing && modelToEdit) {
            onSave({ ...modelData, id: modelToEdit.id });
        } else {
            onSave(modelData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex-shrink-0">{isEditing ? 'Editar' : 'Criar Novo'} Modelo de Processo</h2>
                <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-4 -mr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome do Modelo</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={inputStyles} required />
                        </div>
                        <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Frequência</label>
                            <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as ProcessFrequency)} className={inputStyles} required>
                                {Object.values(ProcessFrequency).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} className={inputStyles} />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Tarefas do Modelo</h3>
                        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                             {tasks.map((task, index) => (
                                <div key={task.id} className="flex items-center gap-3 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-md">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Título da tarefa"
                                            value={task.title}
                                            onChange={e => handleTaskChange(index, 'title', e.target.value)}
                                            className="w-full bg-transparent focus:outline-none text-black dark:text-white"
                                            required
                                        />
                                    </div>
                                     <div className="flex items-center gap-2 flex-shrink-0">
                                        <label className="text-sm text-zinc-500 dark:text-zinc-400">Vencimento no dia:</label>
                                        <input
                                            type="number"
                                            value={task.dueDayOffset}
                                            onChange={e => handleTaskChange(index, 'dueDayOffset', parseInt(e.target.value, 10))}
                                            className="w-16 bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-1 px-2 text-black dark:text-white text-center"
                                            min="1"
                                            max={frequency === ProcessFrequency.Yearly ? 365 : 31}
                                            required
                                        />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveTask(index)} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddTask} className="w-full text-sm text-gold hover:text-gold-light py-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors">
                                Adicionar Tarefa
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">Salvar Modelo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};