
import React, { useState, useMemo, useEffect } from 'react';
// FIX: Removed 'Partial' from import as it is a built-in TypeScript utility type.
import { Client, OnboardingStatus, ClientStage, NewClientData } from '../types';
import { STATUS_COLORS } from '../constants';
import { PipeRunImportModal } from './modals/PipeRunImportModal';
import { EKontrollImportModal } from './modals/EKontrollImportModal';

interface ClientListViewProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onStartAddClient: () => void;
  bulkUpdateClients: (clientIds: string[], updatedData: Partial<Client>) => void;
  accountingResponsibles: string[];
  addClient?: (client: NewClientData) => void; // Optional prop to handle import
}

// Modal for bulk updating the responsible person
const UpdateResponsibleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newResponsible: string) => void;
    responsibles: string[];
    selectedCount: number;
}> = ({ isOpen, onClose, onSave, responsibles, selectedCount }) => {
    const [selectedResponsible, setSelectedResponsible] = useState(responsibles[0] || '');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedResponsible);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Alterar Responsável</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 -mt-4">Para {selectedCount} cliente(s) selecionado(s).</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="responsible" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Novo Responsável</label>
                        <select id="responsible" value={selectedResponsible} onChange={e => setSelectedResponsible(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-primary focus:border-primary">
                            {responsibles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-zinc-900 font-bold rounded-md hover:bg-primary-dark">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal for bulk updating the fee
const UpdateFeeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newFee: string) => void;
    selectedCount: number;
}> = ({ isOpen, onClose, onSave, selectedCount }) => {
    const [newFee, setNewFee] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNaN(parseFloat(newFee))) {
            alert("Por favor, insira um valor numérico válido para o honorário.");
            return;
        }
        onSave(newFee);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Alterar Honorário</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 -mt-4">Para {selectedCount} cliente(s) selecionado(s).</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fee" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Novo Valor do Honorário (R$)</label>
                        <input type="text" id="fee" value={newFee} onChange={e => setNewFee(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-primary focus:border-primary" placeholder="Ex: 1500.00" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-zinc-900 font-bold rounded-md hover:bg-primary-dark">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const allColumns: { id: keyof Client | 'actions' | 'lastContact' | 'fee' | 'accountingResponsible' | 'npsScore'; label: string }[] = [
    { id: 'companyName', label: 'Empresa' },
    { id: 'name', label: 'Responsável' },
    { id: 'npsScore', label: 'NPS' },
    { id: 'lastContact', label: 'Último Contato' },
    { id: 'stage', label: 'Etapa' },
    { id: 'onboardingStatus', label: 'Status' },
    { id: 'accountingResponsible', label: 'Resp. Contábil' },
    { id: 'fee', label: 'Honorário' },
    { id: 'phone', label: 'Telefone' },
    { id: 'plan', label: 'Plano' },
    { id: 'taxRegime', label: 'Regime Tributário' },
    { id: 'joinedDate', label: 'Data de Entrada' },
];

const defaultVisibleColumns: Record<string, boolean> = {
    companyName: true,
    name: true,
    npsScore: true,
    lastContact: true,
    stage: true,
    onboardingStatus: true,
    accountingResponsible: false,
    fee: true,
    phone: false,
    plan: false,
    taxRegime: false,
    joinedDate: false,
};

const getInitialVisibleColumns = (): Record<string, boolean> => {
    try {
        const saved = localStorage.getItem('clientListViewColumns');
        if (saved) {
            const parsed = JSON.parse(saved);
            const merged = { ...defaultVisibleColumns };
            for(const col of allColumns) {
                if(parsed[col.id] !== undefined) {
                    merged[col.id] = parsed[col.id];
                } else if (merged[col.id] === undefined) {
                    // Add new columns that might not be in localStorage yet
                    merged[col.id] = defaultVisibleColumns[col.id] ?? false;
                }
            }
            return merged;
        }
    } catch (e) {
        console.error("Failed to parse column visibility from localStorage", e);
    }
    return defaultVisibleColumns;
};


export const ClientListView: React.FC<ClientListViewProps> = ({ clients, onSelectClient, onStartAddClient, bulkUpdateClients, accountingResponsibles, addClient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'all'>('all');
    const [stageFilter, setStageFilter] = useState<ClientStage | 'all'>('all');
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(getInitialVisibleColumns);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
    const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [isPipeRunModalOpen, setIsPipeRunModalOpen] = useState(false);
    const [isEKontrollModalOpen, setIsEKontrollModalOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('clientListViewColumns', JSON.stringify(visibleColumns));
        } catch(e) {
            console.error("Failed to save column visibility to localStorage", e);
        }
    }, [visibleColumns]);

    const handleColumnToggle = (id: string) => {
        setVisibleColumns(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = searchTerm === '' ||
                client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || client.onboardingStatus === statusFilter;
            const matchesStage = stageFilter === 'all' || client.stage === stageFilter;

            return matchesSearch && matchesStatus && matchesStage;
        });
    }, [clients, searchTerm, statusFilter, stageFilter]);
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedClientIds(filteredClients.map(c => c.id));
        } else {
            setSelectedClientIds([]);
        }
    };
    
    const handleSelectOne = (clientId: string) => {
        setSelectedClientIds(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const handleUpdateResponsible = (newResponsible: string) => {
        bulkUpdateClients(selectedClientIds, { accountingResponsible: newResponsible });
        setIsResponsibleModalOpen(false);
        setSelectedClientIds([]);
    };
    
    const handleUpdateFee = (newFee: string) => {
        bulkUpdateClients(selectedClientIds, { fee: newFee });
        setIsFeeModalOpen(false);
        setSelectedClientIds([]);
    };

    const handleImport = (newClients: NewClientData[]) => {
        if (addClient) {
            newClients.forEach(client => addClient(client));
            alert(`${newClients.length} clientes importados com sucesso!`);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white">Lista de Clientes ({filteredClients.length})</h3>
                <div className="flex gap-4">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou empresa..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-black dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                    {addClient && (
                        <>
                            <button onClick={() => setIsPipeRunModalOpen(true)} className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Importar PipeRun
                            </button>
                            <button onClick={() => setIsEKontrollModalOpen(true)} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                Importar e-Kontroll
                            </button>
                        </>
                    )}
                    <button onClick={onStartAddClient} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Novo Cliente
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Filtrar por:</label>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as OnboardingStatus | 'all')}
                    className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg py-2 pl-3 pr-8 text-black dark:text-white focus:ring-primary"
                >
                    <option value="all">Todos os Status</option>
                    {Object.values(OnboardingStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                 <select
                    value={stageFilter}
                    onChange={e => setStageFilter(e.target.value as ClientStage | 'all')}
                    className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg py-2 pl-3 pr-8 text-black dark:text-white focus:ring-primary"
                >
                    <option value="all">Todas as Etapas</option>
                    {Object.values(ClientStage).map(stage => (
                        <option key={stage} value={stage} className="capitalize">{stage}</option>
                    ))}
                </select>
                <div className="relative ml-auto">
                    <button onClick={() => setIsPickerOpen(!isPickerOpen)} className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        Colunas
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isPickerOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-10 p-2">
                            {allColumns.map(col => (
                                <label key={col.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[col.id] ?? false}
                                        onChange={() => handleColumnToggle(col.id)}
                                        className="h-4 w-4 rounded text-primary bg-zinc-200 dark:bg-zinc-600 border-zinc-300 dark:border-zinc-500 focus:ring-primary"
                                    />
                                    <span className="text-sm text-zinc-700 dark:text-zinc-200">{col.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedClientIds.length > 0 && (
                <div className="bg-blue-100 dark:bg-zinc-800 p-3 rounded-lg flex justify-between items-center mb-4 animate-fadeInUp">
                    <span className="text-sm font-semibold text-blue-800 dark:text-white">{selectedClientIds.length} cliente(s) selecionado(s)</span>
                    <div className="flex gap-3">
                        <button onClick={() => setIsResponsibleModalOpen(true)} className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 dark:bg-primary-dark dark:text-black dark:hover:bg-primary">Alterar Responsável</button>
                        <button onClick={() => setIsFeeModalOpen(true)} className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 dark:bg-primary-dark dark:text-black dark:hover:bg-primary">Alterar Honorário</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-zinc-200 dark:border-zinc-700">
                        <tr>
                            <th className="p-4 w-12">
                                <input type="checkbox"
                                   checked={filteredClients.length > 0 && selectedClientIds.length === filteredClients.length}
                                   onChange={handleSelectAll}
                                   className="h-4 w-4 rounded text-primary bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 focus:ring-primary"
                                 />
                            </th>
                            {allColumns.map(col => visibleColumns[col.id] && (
                                <th key={col.id} className="p-4 font-semibold text-zinc-600 dark:text-gray-300">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredClients.map((client) => {
                             const lastContact = client.communicationLogs && client.communicationLogs.length > 0
                                ? new Date(
                                    Math.max(
                                        ...client.communicationLogs.map(log => new Date(log.date).getTime())
                                    )
                                  ).toLocaleDateString('pt-BR')
                                : 'N/A';

                            return (
                                <tr key={client.id} className={`transition-colors duration-150 ${selectedClientIds.includes(client.id) ? 'bg-primary/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox"
                                           checked={selectedClientIds.includes(client.id)}
                                           onChange={() => handleSelectOne(client.id)}
                                           className="h-4 w-4 rounded text-primary bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 focus:ring-primary"
                                         />
                                    </td>
                                    {Object.entries(visibleColumns).map(([key, isVisible]) => {
                                        if (!isVisible) return null;
                                        const value = client[key as keyof Client];
                                        let content: React.ReactNode;
                                        switch (key) {
                                            case 'companyName':
                                                content = <div onClick={() => onSelectClient(client.id)} className="cursor-pointer group"><span className="font-medium text-black dark:text-white group-hover:text-primary-light transition-colors">{client.companyName}</span> <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">{client.email}</span></div>;
                                                break;
                                            case 'onboardingStatus':
                                                content = <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[client.onboardingStatus]}`}>{client.onboardingStatus}</span>;
                                                break;
                                            case 'stage':
                                                content = <span className="capitalize">{client.stage}</span>;
                                                break;
                                            case 'joinedDate':
                                                content = new Date(client.joinedDate).toLocaleDateString('pt-BR');
                                                break;
                                            case 'lastContact':
                                                content = lastContact;
                                                break;
                                            case 'npsScore':
                                                const nps = client.npsScore;
                                                let npsColor = 'bg-zinc-100 text-zinc-500';
                                                if (nps !== undefined) {
                                                    if (nps >= 9) npsColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                                                    else if (nps >= 7) npsColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                                                    else npsColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
                                                }
                                                content = nps !== undefined ? <span className={`px-2 py-1 rounded text-xs font-bold ${npsColor}`}>{nps}</span> : <span className="text-zinc-400">-</span>;
                                                break;
                                            case 'fee':
                                                content = parseFloat(client.fee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                                break;
                                            default:
                                                content = String(value ?? '');
                                        }
                                        return <td key={key} className="p-4 text-zinc-600 dark:text-zinc-300 cursor-pointer" onClick={() => onSelectClient(client.id)}>{content}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredClients.length === 0 && (
                    <div className="text-center py-10 text-zinc-500 dark:text-zinc-500">
                        <p>Nenhum cliente encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
            <UpdateResponsibleModal isOpen={isResponsibleModalOpen} onClose={() => setIsResponsibleModalOpen(false)} onSave={handleUpdateResponsible} responsibles={accountingResponsibles} selectedCount={selectedClientIds.length} />
            <UpdateFeeModal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} onSave={handleUpdateFee} selectedCount={selectedClientIds.length} />
            <PipeRunImportModal isOpen={isPipeRunModalOpen} onClose={() => setIsPipeRunModalOpen(false)} onImport={handleImport} />
            <EKontrollImportModal isOpen={isEKontrollModalOpen} onClose={() => setIsEKontrollModalOpen(false)} onImport={handleImport} />
        </div>
    );
};
