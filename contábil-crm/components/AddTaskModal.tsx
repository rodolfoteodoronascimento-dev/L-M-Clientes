
import React, { useState } from 'react';
import { Task, Client, TaskPriority, TaskStatus } from '../types';

interface AddTaskModalProps {
    clients: Client[];
    onClose: () => void;
    onSave: (task: Omit<Task, 'id'>) => void;
    defaultClientId?: string;
}

const FormSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <span className="bg-primary text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                {number}
            </span>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                {title}
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputBaseClass = "w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl px-5 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium";

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ clients, onClose, onSave, defaultClientId }) => {
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState(defaultClientId || (clients.length > 0 ? clients[0].id : ''));
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.ToDo);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [responsibleNames, setResponsibleNames] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) {
            alert("Por favor, selecione um cliente.");
            return;
        }
        const dateParts = dueDate.split('-').map(part => parseInt(part, 10));
        const adjustedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        onSave({
            title,
            clientId,
            dueDate: adjustedDate,
            status,
            priority,
            responsibleNames,
            description
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] bg-zinc-100 dark:bg-zinc-950 flex flex-col animate-fadeInUp overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full py-16 px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Lançar Demanda</h1>
                        <p className="text-zinc-500 dark:text-zinc-500 text-xl font-medium">Crie obrigações e controle prazos com precisão.</p>
                    </div>
                    <button onClick={onClose} className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl font-bold transition-all flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        Cancelar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormSection number="1" title="Escopo da Tarefa">
                        <div className="md:col-span-2">
                            <Field label="Título da Obrigação" required>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Envio do PGDAS - Março/2024" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    className={inputBaseClass} 
                                    required 
                                    autoFocus
                                />
                            </Field>
                        </div>
                        <Field label="Empresa Associada" required>
                            <select 
                                value={clientId} 
                                onChange={e => setClientId(e.target.value)} 
                                disabled={!!defaultClientId} 
                                className={inputBaseClass}
                                required
                            >
                                <option value="" disabled>Escolha um cliente...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                        </Field>
                    </FormSection>

                    <FormSection number="2" title="Cronograma e Equipe">
                        <Field label="Prazo Fatal" required>
                            <input 
                                type="date" 
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)} 
                                className={inputBaseClass} 
                                required
                            />
                        </Field>
                        <Field label="Criticidade (Prioridade)">
                            <select 
                                value={priority} 
                                onChange={e => setPriority(e.target.value as TaskPriority)} 
                                className={inputBaseClass}
                            >
                                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </Field>
                        <Field label="Responsável Interno">
                            <input 
                                type="text" 
                                placeholder="Analista encarregado" 
                                value={responsibleNames} 
                                onChange={e => setResponsibleNames(e.target.value)} 
                                className={inputBaseClass} 
                            />
                        </Field>
                    </FormSection>

                    <FormSection number="3" title="Instruções Adicionais">
                        <div className="md:col-span-3">
                            <Field label="Notas e Checkpoint">
                                <textarea 
                                    placeholder="Dicas técnicas ou observações cruciais para esta tarefa específica..." 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    rows={6}
                                    className={`${inputBaseClass} resize-none`}
                                />
                            </Field>
                        </div>
                    </FormSection>

                    <div className="flex justify-end gap-6 mt-12 pb-24 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                        <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all">
                            Descartar
                        </button>
                        <button type="submit" className="px-12 py-5 bg-primary text-zinc-900 font-black rounded-2xl hover:bg-primary-light transition-all transform active:scale-95 shadow-xl shadow-primary/20 flex items-center gap-4 uppercase tracking-widest text-sm">
                            <span>Lançar na Agenda</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
