import React, { useState, useEffect } from 'react';
import { CalendarItem, CalendarEvent, Task, TaskStatus } from '../types';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
    onDelete: (eventId: string) => void;
    item: CalendarItem | null;
    selectedDate: Date | null;
}

const eventColors = [
    { name: 'blue', label: 'Reunião', class: 'bg-sky-500' },
    { name: 'green', label: 'Pessoal', class: 'bg-emerald-500' },
    { name: 'yellow', label: 'Importante', class: 'bg-amber-500' },
    { name: 'red', label: 'Prazo', class: 'bg-red-500' },
    { name: 'purple', label: 'Outro', class: 'bg-purple-500' },
];

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, item, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('10:00');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('blue');

    const isTask = item?.type === 'task';

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            if (item.type === 'event') {
                const start = new Date(item.start);
                const end = new Date(item.end);
                setStartDate(start.toISOString().split('T')[0]);
                setStartTime(start.toTimeString().substring(0, 5));
                setEndDate(end.toISOString().split('T')[0]);
                setEndTime(end.toTimeString().substring(0, 5));
                setDescription(item.description || '');
                setColor(item.color);
            } else { // Task
                const dueDate = new Date(item.dueDate);
                setStartDate(dueDate.toISOString().split('T')[0]);
                setEndDate(dueDate.toISOString().split('T')[0]);
                setDescription(`Tarefa para cliente: ${item.clientId}`); // Example description
            }
        } else if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            setTitle('');
            setStartDate(dateStr);
            setEndDate(dateStr);
            setDescription('');
            setColor('blue');
        }
    }, [item, selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isTask) {
            // Logic for updating a task would go here, but the current design focuses on calendar events.
            // For now, we'll just close the modal for tasks.
             onClose();
             return;
        }

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        const eventData = {
            id: item?.id,
            title,
            start: startDateTime,
            end: endDateTime,
            description,
            color,
        };
        onSave(eventData as CalendarEvent);
        onClose();
    };
    
    const handleDelete = () => {
        if (item && item.type === 'event') {
            if (window.confirm(`Tem certeza que deseja excluir o evento "${item.title}"?`)) {
                onDelete(item.id);
                onClose();
            }
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeInUp" style={{animationDuration: '0.2s'}}>
            <div className="bg-white/80 dark:bg-zinc-900/80 p-8 rounded-lg shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700/50">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{item ? 'Editar Evento' : 'Novo Evento'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Título</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={isTask} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" required />
                    </div>
                    
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="startDate" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Data de Início</label>
                           <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isTask} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" required />
                        </div>
                        <div>
                           <label htmlFor="startTime" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Hora de Início</label>
                           <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} disabled={isTask} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" />
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="endDate" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Data de Fim</label>
                           <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isTask} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" required />
                        </div>
                        <div>
                           <label htmlFor="endTime" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Hora de Fim</label>
                           <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} disabled={isTask} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Rótulo</label>
                        <div className="mt-2 flex flex-wrap gap-3 text-black dark:text-white">
                            {eventColors.map(c => (
                                <button type="button" key={c.name} disabled={isTask} onClick={() => setColor(c.name)} className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 border-2 ${color === c.name ? 'border-primary dark:border-white' : 'border-transparent'}`}>
                                    <span className={`w-3 h-3 rounded-full ${c.class}`}></span>
                                    <span>{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-600 dark:text-gray-300">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} disabled={isTask} rows={3} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50" />
                    </div>


                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                          {item && item.type === 'event' && (
                            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-300 rounded-md hover:bg-red-300 dark:hover:bg-red-800/80">Excluir</button>
                          )}
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                            {!isTask && <button type="submit" className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary-light">Salvar</button>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};