import React, { useState } from 'react';
import { ProcessModel, TaskTemplate } from '../types';
import { ProcessModelModal } from './modals/ProcessModelModal';

interface ProcessModelsViewProps {
    models: ProcessModel[];
    addProcessModel: (model: Omit<ProcessModel, 'id'>) => void;
    updateProcessModel: (model: ProcessModel) => void;
    deleteProcessModel: (modelId: string) => void;
}

export const ProcessModelsView: React.FC<ProcessModelsViewProps> = ({ models, addProcessModel, updateProcessModel, deleteProcessModel }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<ProcessModel | null>(null);

    const handleOpenAddModal = () => {
        setEditingModel(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (model: ProcessModel) => {
        setEditingModel(model);
        setIsModalOpen(true);
    };

    const handleSave = (modelData: ProcessModel | Omit<ProcessModel, 'id'>) => {
        if ('id' in modelData) {
            updateProcessModel(modelData);
        } else {
            addProcessModel(modelData);
        }
        setIsModalOpen(false);
    };
    
    const handleDelete = (modelId: string) => {
        if(window.confirm("Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.")) {
            deleteProcessModel(modelId);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white">Modelos de Processos</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Crie e gerencie templates de tarefas para automatizar obrigações recorrentes.</p>
                </div>
                <button onClick={handleOpenAddModal} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Novo Modelo
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Modelos Existentes</h3>
                {models.length > 0 ? (
                    <div className="space-y-4">
                        {models.map(model => (
                            <div key={model.id} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-black dark:text-white">{model.name}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{model.description}</p>
                                        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300">
                                            <span className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-full">{model.frequency}</span>
                                            <span className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-full">{model.tasks.length} Tarefas</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenEditModal(model)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md" aria-label="Editar modelo">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(model.id)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md" aria-label="Excluir modelo">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-zinc-500 dark:text-zinc-400 py-16">
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" /></svg>
                        <h3 className="mt-2 text-lg font-medium text-black dark:text-white">Nenhum modelo de processo criado</h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Crie seu primeiro modelo para começar a automatizar tarefas.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ProcessModelModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    modelToEdit={editingModel}
                />
            )}
        </div>
    );
};