

import React, { useState, useEffect } from 'react';
import { BVC, Client } from '../types';

interface BvcViewProps {
    clients: Client[];
    bvcs: BVC[];
    addBvc: (bvc: Omit<BVC, 'id'>) => void;
    updateBvc: (bvc: BVC) => void;
    deleteBvc: (bvcId: string) => void;
    onSelectClient: (clientId: string) => void;
}

const BvcModal: React.FC<{
    onClose: () => void;
    clients: Client[];
    onSave: (bvc: Omit<BVC, 'id'> | BVC) => void;
    bvcToEdit: BVC | null;
}> = ({ onClose, clients, onSave, bvcToEdit }) => {
    const isEditing = bvcToEdit !== null;
    const [clientId, setClientId] = useState(bvcToEdit?.clientId || '');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [consultant, setConsultant] = useState(bvcToEdit?.consultant || '');
    const [objective, setObjective] = useState(bvcToEdit?.objective || '');
    const [summary, setSummary] = useState(bvcToEdit?.summary || '');

    useEffect(() => {
        if (isEditing && bvcToEdit) {
            setClientId(bvcToEdit.clientId);
            setVisitDate(new Date(bvcToEdit.visitDate).toISOString().split('T')[0]);
            setConsultant(bvcToEdit.consultant);
            setObjective(bvcToEdit.objective);
            setSummary(bvcToEdit.summary);
        }
    }, [bvcToEdit, isEditing]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!clientId) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        const dateParts = visitDate.split('-').map(part => parseInt(part, 10));
        const adjustedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        const bvcData = {
            clientId,
            visitDate: adjustedDate,
            consultant,
            objective,
            summary,
        };

        if (isEditing && bvcToEdit) {
            onSave({ ...bvcData, id: bvcToEdit.id });
        } else {
            onSave(bvcData);
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{isEditing ? 'Editar' : 'Registrar'} Boletim de Visita</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Cliente</label>
                        <select id="clientId" value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required>
                             <option value="" disabled>Selecione um cliente</option>
                             {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="visitDate" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Data da Visita</label>
                            <input type="date" id="visitDate" value={visitDate} onChange={e => setVisitDate(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label htmlFor="consultant" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Consultor</label>
                            <input type="text" id="consultant" value={consultant} onChange={e => setConsultant(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required placeholder="Nome do consultor" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="objective" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Objetivo da Visita</label>
                        <input type="text" id="objective" value={objective} onChange={e => setObjective(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                     <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Resumo da Conversa</label>
                        <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={4} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-md hover:from-primary-light hover:to-primary transition-all">Salvar BVC</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const BvcView: React.FC<BvcViewProps> = ({ clients, bvcs, addBvc, updateBvc, deleteBvc, onSelectClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBvc, setEditingBvc] = useState<BVC | null>(null);

    const getClientNameById = (id: string) => clients.find(c => c.id === id)?.companyName || 'Cliente não encontrado';

    const handleOpenAddModal = () => {
        setEditingBvc(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (bvc: BVC) => {
        setEditingBvc(bvc);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBvc(null);
    };

    const handleSave = (bvcData: Omit<BVC, 'id'> | BVC) => {
        if ('id' in bvcData) {
            updateBvc(bvcData);
        } else {
            addBvc(bvcData);
        }
        handleCloseModal();
    };
    
    const handleDelete = (bvcId: string, clientName: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o BVC para "${clientName}"? Esta ação não pode ser desfeita.`)) {
            deleteBvc(bvcId);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-black dark:text-white">Boletins de Visita ao Cliente</h1>
                 <button onClick={handleOpenAddModal} className="px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-lg hover:from-primary-light hover:to-primary transition-all transform active:scale-95 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Registrar Visita
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Histórico de Visitas</h3>
                {bvcs.length > 0 ? (
                    <div className="space-y-4">
                    {bvcs.map(bvc => (
                        <div key={bvc.id} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300 hover:border-primary-dark transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{bvc.visitDate.toLocaleDateString('pt-BR')}</p>
                                    <button onClick={() => onSelectClient(bvc.clientId)} className="text-left">
                                        <p className="text-lg font-semibold text-primary hover:underline">{getClientNameById(bvc.clientId)}</p>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Consultor: <span className="font-medium text-black dark:text-white">{bvc.consultant}</span></p>
                                    <button onClick={() => handleOpenEditModal(bvc)} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white" aria-label="Editar BVC">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                     <button onClick={() => handleDelete(bvc.id, getClientNameById(bvc.clientId))} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-red-500" aria-label="Excluir BVC">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="font-semibold text-black dark:text-white">{bvc.objective}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{bvc.summary}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 text-center py-8">Nenhum boletim de visita registrado ainda.</p>
                )}
            </div>

            {isModalOpen && <BvcModal onClose={handleCloseModal} clients={clients} onSave={handleSave} bvcToEdit={editingBvc} />}
        </div>
    );
};