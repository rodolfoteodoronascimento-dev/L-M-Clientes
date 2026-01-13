import React, { useState } from 'react';
import { Lead, LeadStage, LeadStatus, LeadSource } from '../types';

interface LeadsViewProps {
    leads: Lead[];
    addLead: (lead: Omit<Lead, 'id' | 'status' | 'stage' | 'lastContacted'>) => void;
    updateLeadStage: (leadId: string, stage: LeadStage) => void;
    updateLeadStatus: (leadId: string, status: LeadStatus) => void;
}

const AddLeadModal: React.FC<{
    onClose: () => void;
    addLead: (lead: Omit<Lead, 'id' | 'status' | 'stage' | 'lastContacted'>) => void;
}> = ({ onClose, addLead }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [value, setValue] = useState('');
    const [source, setSource] = useState<LeadSource>(LeadSource.Website);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addLead({
            name,
            company,
            value: Number(value),
            source,
        });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Adicionar Novo Lead</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome do Contato</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                    </div>
                     <div>
                        <label htmlFor="company" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Empresa</label>
                        <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Valor (R$)</label>
                            <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                        </div>
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Origem</label>
                            <select id="source" value={source} onChange={e => setSource(e.target.value as LeadSource)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required>
                                {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">Salvar Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const LeadsView: React.FC<LeadsViewProps> = ({ leads, addLead, updateLeadStage, updateLeadStatus }) => {
    const [editingCell, setEditingCell] = useState<{ leadId: string; field: 'status' | 'stage' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = searchTerm === '' || 
                              lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              lead.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleSelectChange = (leadId: string, field: 'status' | 'stage', value: string) => {
        if (field === 'status') {
            updateLeadStatus(leadId, value as LeadStatus);
        } else {
            updateLeadStage(leadId, value as LeadStage);
        }
        setEditingCell(null);
    };

    const stageColors: Record<LeadStage, string> = {
        [LeadStage.New]: 'bg-gray-400 dark:bg-gray-500',
        [LeadStage.Contacted]: 'bg-cyan-400 dark:bg-cyan-500',
        [LeadStage.Qualified]: 'bg-blue-400 dark:bg-blue-500',
        [LeadStage.Proposal]: 'bg-indigo-400 dark:bg-indigo-500',
        [LeadStage.Negotiation]: 'bg-purple-400 dark:bg-purple-500',
        [LeadStage.Nurturing]: 'bg-orange-400 dark:bg-orange-500',
    };

    const statusColors: Record<LeadStatus, string> = {
        [LeadStatus.Open]: 'bg-yellow-400 dark:bg-yellow-500',
        [LeadStatus.Won]: 'bg-green-400 dark:bg-green-500',
        [LeadStatus.Lost]: 'bg-red-400 dark:bg-red-500',
    };

    const renderCell = (lead: Lead, field: 'status' | 'stage') => {
        if (editingCell?.leadId === lead.id && editingCell?.field === field) {
            const options = field === 'status' ? Object.values(LeadStatus) : Object.values(LeadStage);
            const value = field === 'status' ? lead.status : lead.stage;
            
            return (
                <select
                    value={value}
                    onChange={(e) => handleSelectChange(lead.id, field, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm py-1 px-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                >
                    {options.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            );
        }

        if (field === 'status') {
            return (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-black ${statusColors[lead.status]}`}>
                    {lead.status}
                </span>
            );
        }

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${stageColors[lead.stage]}`}>
                {lead.stage}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-white">Todos os Leads ({leads.length})</h3>
                 <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou empresa..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-black dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                    />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Novo Lead
                </button>
            </div>
             <div className="flex items-center gap-4 mb-6">
                 <label htmlFor="status-filter" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Filtrar por Status:</label>
                  <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
                      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg py-2 pl-3 pr-8 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                  >
                      <option value="all">Todos os Status</option>
                      {Object.values(LeadStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                  </select>
             </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Clique no Status ou na Etapa para editá-los rapidamente.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-zinc-200 dark:border-zinc-700">
                        <tr>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Contato</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Empresa</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Valor (R$)</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Etapa</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-300">Origem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-150">
                                <td className="p-4 text-black dark:text-white">{lead.name}</td>
                                <td className="p-4 text-zinc-600 dark:text-zinc-300">{lead.company}</td>
                                <td className="p-4 text-zinc-600 dark:text-zinc-300">{lead.value.toLocaleString('pt-BR')}</td>
                                <td className="p-4 cursor-pointer" onClick={() => setEditingCell({ leadId: lead.id, field: 'status' })}>
                                    {renderCell(lead, 'status')}
                                </td>
                                <td className="p-4 cursor-pointer" onClick={() => setEditingCell({ leadId: lead.id, field: 'stage' })}>
                                    {renderCell(lead, 'stage')}
                                </td>
                                <td className="p-4 text-zinc-600 dark:text-zinc-300">{lead.source}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredLeads.length === 0 && (
                    <div className="text-center py-10 text-zinc-500">
                        <p>Nenhum lead encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
            {isModalOpen && <AddLeadModal onClose={() => setIsModalOpen(false)} addLead={addLead} />}
        </div>
    );
};