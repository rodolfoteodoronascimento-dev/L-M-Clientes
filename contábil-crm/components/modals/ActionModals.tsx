
import React, { useState } from 'react';
import { CommunicationLog, CommunicationType } from '../../types';

interface LogCommunicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (log: Omit<CommunicationLog, 'id' | 'clientId' | 'date'>) => void;
}

export const LogCommunicationModal: React.FC<LogCommunicationModalProps> = ({ isOpen, onClose, onSave }) => {
    const [type, setType] = useState<CommunicationType>(CommunicationType.Chamada);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ type, subject, content });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Registrar Contato Manual</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Tipo de Contato</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as CommunicationType)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-primary focus:border-primary">
                                {Object.values(CommunicationType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Assunto/Título</label>
                            <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-primary focus:border-primary" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Resumo</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={4} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-primary focus:border-primary" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-md hover:from-primary-light hover:to-primary transition-all">Salvar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
