
import React, { useState } from 'react';
import { FormModel } from '../types';
import { FormModelModal } from './modals/FormModelModal';
import { ImportFormModal } from './modals/ImportFormModal';

export const FormsView: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [forms, setForms] = useState<FormModel[]>([
        { id: '1', name: 'Formulário de Qualificação de Lead', description: 'Coleta informações iniciais para qualificar novos leads.', fields: [] },
        { id: '2', name: 'Formulário de Proposta Comercial', description: 'Gera uma proposta padronizada para clientes.', fields: [] },
        { id: '3', name: 'Formulário de Pesquisa de Satisfação', description: 'Enviado após a conclusão de um projeto ou onboarding.', fields: [] },
    ]);

    const handleSaveForm = (newForm: FormModel) => {
        setForms(prev => [newForm, ...prev]);
        setIsCreateModalOpen(false);
        setIsImportModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Biblioteca de Formulários</h1>
                    <p className="text-zinc-500 text-sm">Gerencie os modelos de coleta de dados do seu escritório.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-5 py-2.5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all transform active:scale-95 flex items-center gap-2 border border-zinc-200 dark:border-zinc-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Importar
                    </button>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-2.5 bg-primary text-zinc-900 font-black rounded-xl hover:bg-primary-light transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Novo Modelo
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {forms.map(form => (
                         <div key={form.id} className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/50 transition-all group">
                            <div>
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-zinc-900 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                </div>
                                <h4 className="font-bold text-black dark:text-white mb-2">{form.name}</h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6">{form.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold py-2 rounded-lg text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all">
                                    Configurar
                                </button>
                                <button className="flex-1 bg-primary text-zinc-900 font-bold py-2 rounded-lg text-xs hover:bg-primary-light transition-all">
                                    Usar Modelo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {forms.length === 0 && (
                    <div className="text-center py-20 text-zinc-500">
                        <p>Nenhum modelo de formulário encontrado.</p>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <FormModelModal 
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleSaveForm}
                />
            )}

            {isImportModalOpen && (
                <ImportFormModal 
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleSaveForm}
                />
            )}
        </div>
    );
};
