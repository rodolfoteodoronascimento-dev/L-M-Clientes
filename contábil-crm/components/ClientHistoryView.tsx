
import React, { useState } from 'react';
import { ClientHistoryEvent, HistoryEventType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ClientHistoryViewProps {
    history: ClientHistoryEvent[];
    onAddHistory: (event: Omit<ClientHistoryEvent, 'id' | 'date'>) => void;
}

const eventTypeStyles: Record<HistoryEventType, { bg: string, text: string, border: string }> = {
    [HistoryEventType.Complaint]: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', border: 'border-red-500' },
    [HistoryEventType.Praise]: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', border: 'border-green-500' },
    [HistoryEventType.RelevantFact]: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-500' },
    [HistoryEventType.ContractChange]: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-500' },
    [HistoryEventType.General]: { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-800 dark:text-zinc-300', border: 'border-zinc-500' },
};

export const ClientHistoryView: React.FC<ClientHistoryViewProps> = ({ history, onAddHistory }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [description, setDescription] = useState('');
    const [type, setType] = useState<HistoryEventType>(HistoryEventType.General);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddHistory({
            description,
            type,
            clientId: '', // Will be filled by parent
            author: 'Usuário Atual' // Mocked user
        });
        setDescription('');
        setType(HistoryEventType.General);
        setIsAdding(false);
    };

    const sortedHistory = [...history].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black dark:text-white">Linha do Tempo</h3>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-primary-light transition-colors text-sm">
                    {isAdding ? 'Cancelar' : 'Adicionar Fato'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Tipo de Evento</label>
                            <select value={type} onChange={e => setType(e.target.value as HistoryEventType)} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-primary focus:border-primary">
                                {Object.values(HistoryEventType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Descrição</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-primary focus:border-primary" required placeholder="Descreva o que aconteceu..." />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary text-black font-bold px-4 py-2 rounded-md hover:bg-primary-light">Salvar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-700 ml-3 space-y-8">
                {sortedHistory.length > 0 ? sortedHistory.map((item) => (
                    <div key={item.id} className="relative pl-8">
                        <span className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 bg-white dark:bg-zinc-900 ${eventTypeStyles[item.type].border}`}></span>
                        <div className={`p-4 rounded-lg border ${eventTypeStyles[item.type].bg} border-zinc-200 dark:border-zinc-700/50`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${eventTypeStyles[item.type].text} border-${eventTypeStyles[item.type].border.split('-')[1]}-200`}>
                                    {item.type}
                                </span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-black dark:text-white text-sm">{item.description}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Registrado por: {item.author}</p>
                        </div>
                    </div>
                )) : (
                    <p className="pl-8 text-zinc-500 dark:text-zinc-400">Nenhum histórico registrado.</p>
                )}
            </div>
        </div>
    );
};
