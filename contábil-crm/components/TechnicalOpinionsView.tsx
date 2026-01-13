
import React, { useState } from 'react';
import { TechnicalOpinion, OpinionType } from '../types';

interface TechnicalOpinionsViewProps {
    opinions: TechnicalOpinion[];
    onAddOpinion: (opinion: Omit<TechnicalOpinion, 'id' | 'date'>) => void;
}

export const TechnicalOpinionsView: React.FC<TechnicalOpinionsViewProps> = ({ opinions, onAddOpinion }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<OpinionType>(OpinionType.PTI);
    const [tags, setTags] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddOpinion({
            title,
            content,
            type,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            clientId: '', // To be filled by parent
            author: 'Usuário Atual'
        });
        setTitle('');
        setContent('');
        setTags('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">Pareceres Técnicos</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">PTI (Interno) e PTC (Cliente)</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors text-sm">
                    {isAdding ? 'Cancelar' : 'Novo Parecer'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Tipo</label>
                                <select value={type} onChange={e => setType(e.target.value as OpinionType)} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-gold focus:border-gold">
                                    <option value={OpinionType.PTI}>PTI - Parecer Técnico Interno</option>
                                    <option value={OpinionType.PTC}>PTC - Parecer Técnico Cliente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Tags (separadas por vírgula)</label>
                                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-gold focus:border-gold" placeholder="Ex: Fiscal, Tributário, Risco" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Título</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-gold focus:border-gold" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">Conteúdo Técnico</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className="w-full bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md p-2 text-black dark:text-white focus:ring-gold focus:border-gold" required />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-gold text-black font-bold px-6 py-2 rounded-md hover:bg-gold-light">Registrar Parecer</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {opinions.length > 0 ? opinions.map(op => (
                    <div key={op.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 text-xs font-bold rounded-md ${op.type === OpinionType.PTI ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                                    {op.type === OpinionType.PTI ? 'INTERNO' : 'CLIENTE'}
                                </span>
                                <h4 className="text-lg font-bold text-black dark:text-white">{op.title}</h4>
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(op.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap mb-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-700/30">
                            {op.content}
                        </p>

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2">
                                {op.tags?.map(tag => (
                                    <span key={tag} className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-full">#{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-500 italic">Autor: {op.author}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">Nenhum parecer técnico registrado.</p>
                )}
            </div>
        </div>
    );
};
