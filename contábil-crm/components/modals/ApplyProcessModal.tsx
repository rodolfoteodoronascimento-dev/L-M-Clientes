import React, { useState, useMemo } from 'react';
import { ProcessModel, AppliedProcess } from '../../types';

interface ApplyProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    processModels: ProcessModel[];
    clientAppliedProcesses: AppliedProcess[];
    applyProcessToClient: (clientId: string, processModelId: string) => void;
}

export const ApplyProcessModal: React.FC<ApplyProcessModalProps> = ({ isOpen, onClose, clientId, processModels, clientAppliedProcesses, applyProcessToClient }) => {
    
    const availableModels = useMemo(() => {
        const appliedIds = new Set(clientAppliedProcesses.map(ap => ap.processModelId));
        return processModels.filter(pm => !appliedIds.has(pm.id));
    }, [processModels, clientAppliedProcesses]);

    const [selectedModelId, setSelectedModelId] = useState<string>(availableModels.length > 0 ? availableModels[0].id : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModelId) {
            alert("Por favor, selecione um modelo de processo.");
            return;
        }
        applyProcessToClient(clientId, selectedModelId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-lg border border-zinc-800">
                <h2 className="text-2xl font-bold text-white mb-6">Aplicar Processo Recorrente</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="processModel" className="block text-sm font-medium text-zinc-300">Selecione o Modelo</label>
                        <select
                            id="processModel"
                            value={selectedModelId}
                            onChange={e => setSelectedModelId(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-zinc-700 rounded-md shadow-sm focus:ring-gold focus:border-gold bg-zinc-800 text-white"
                            required
                        >
                            {availableModels.length > 0 ? (
                                availableModels.map(model => (
                                    <option key={model.id} value={model.id}>{model.name} ({model.frequency})</option>
                                ))
                            ) : (
                                <option value="" disabled>Nenhum modelo novo para aplicar</option>
                            )}
                        </select>
                         <p className="text-xs text-zinc-400 mt-2">Ao aplicar, as tarefas para o próximo período serão criadas automaticamente.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" disabled={!selectedModelId} className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light disabled:bg-zinc-600 disabled:cursor-not-allowed">
                            Aplicar e Gerar Tarefas
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
