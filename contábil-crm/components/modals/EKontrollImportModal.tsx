
import React, { useState } from 'react';
import { fetchEKontrollClients } from '../../services/ekontrollService';
import { EKontrollClient, NewClientData, ClientPlan, AcquisitionChannel, OnboardingStatus, TaxRegime, EntryProcess } from '../../types';

interface EKontrollImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (clients: NewClientData[]) => void;
}

export const EKontrollImportModal: React.FC<EKontrollImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [apiKey, setApiKey] = useState('mMoFclhlSCJ5LxJNTcIn3sKizKESTAHNzAexOdUavbQ8KRNwv81X8LDtydi7');
    const [isLoading, setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [clients, setClients] = useState<EKontrollClient[]>([]);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);
    const [error, setError] = useState('');

    const handleFetch = async () => {
        if (!apiKey) {
            setError('Por favor, insira a chave da API.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchEKontrollClients(apiKey);
            if (response && response.data) {
                setClients(response.data);
            } else {
                setClients([]);
                setError('Nenhum dado encontrado ou formato de resposta inválido.');
            }
        } catch (err) {
            setError('Falha na comunicação com e-Kontroll. Verifique a chave ou conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectClient = (id: number) => {
        setSelectedClients(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    };

    const handleImport = () => {
        setIsImporting(true);
        const toImport = clients.filter(c => selectedClients.includes(c.id));
        const importedData: NewClientData[] = toImport.map(c => ({
            name: c.nome_fantasia || c.razao_social,
            plan: ClientPlan.DecolaEmpresa,
            responsibleName: 'Contato e-Kontroll',
            responsibleId: '',
            email: c.email_contato || '',
            phone: c.telefone_contato || '',
            state: c.endereco_uf || '',
            city: c.endereco_cidade || '',
            acquisitionChannel: AcquisitionChannel.Outros,
            product: ClientPlan.DecolaEmpresa,
            companyName: c.razao_social,
            cnpj: c.cnpj_cpf,
            domainCode: '',
            category: 'Importado e-Kontroll',
            fee: c.valor_mensalidade ? c.valor_mensalidade.toString() : '0',
            status: OnboardingStatus.Onboarding,
            entryDate: c.data_cadastro || new Date().toISOString().split('T')[0],
            taxRegime: TaxRegime.Indefinido,
            group: 'e-Kontroll',
            entryProcess: EntryProcess.Abertura,
            departmentResponsible: '',
            hasEmployee: 'Não',
            proLabore: 'Não',
            hasCertificate: 'Não',
            fiscalDepartmentResponsible: '',
            rFactor: 'Não',
            mainBranch: '',
            secondaryBranch: '',
            annex: 'Não se aplica',
            secondaryAnnex: 'Não se aplica',
            stateRegistration: '',
            municipalRegistration: '',
            accountingDepartmentResponsible: '',
            closing: '',
            useContaAzul: 'Não',
            banks: [],
            importedLogs: [],
            importedDocs: []
        }));

        // Simulate async operation
        setTimeout(() => {
            onImport(importedData);
            setIsImporting(false);
            onClose();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black dark:text-white">Importar do e-Kontroll</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Integração via API</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-grow overflow-y-auto">
                    
                    {/* API Key Input */}
                    <div className="mb-6 flex gap-3 items-end">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Chave da API e-Kontroll</label>
                            <input 
                                type="text" 
                                value={apiKey} 
                                onChange={(e) => setApiKey(e.target.value)} 
                                placeholder="Insira seu token..." 
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button 
                            onClick={handleFetch} 
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait h-[42px]"
                        >
                            {isLoading ? 'Buscando...' : 'Listar Clientes'}
                        </button>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

                    {/* Results Table */}
                    {clients.length > 0 && (
                        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                    <tr>
                                        <th className="p-3 w-10">
                                            <input 
                                                type="checkbox" 
                                                onChange={(e) => setSelectedClients(e.target.checked ? clients.map(d => d.id) : [])}
                                                checked={selectedClients.length === clients.length}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="p-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Razão Social</th>
                                        <th className="p-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">CNPJ</th>
                                        <th className="p-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Cidade/UF</th>
                                        <th className="p-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Mensalidade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {clients.map(c => (
                                        <tr key={c.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${selectedClients.includes(c.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                            <td className="p-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedClients.includes(c.id)}
                                                    onChange={() => handleSelectClient(c.id)}
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-3 text-sm text-black dark:text-white font-medium">
                                                {c.razao_social}
                                                <div className="text-xs text-zinc-400">{c.nome_fantasia}</div>
                                            </td>
                                            <td className="p-3 text-sm text-zinc-600 dark:text-zinc-300">{c.cnpj_cpf}</td>
                                            <td className="p-3 text-sm text-zinc-600 dark:text-zinc-300">{c.endereco_cidade}/{c.endereco_uf}</td>
                                            <td className="p-3 text-sm text-zinc-600 dark:text-zinc-300">
                                                {c.valor_mensalidade ? c.valor_mensalidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {clients.length === 0 && !isLoading && !error && (
                        <div className="text-center py-12 text-zinc-400">
                            Aguardando busca de dados...
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-b-xl flex justify-between items-center">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{selectedClients.length} itens selecionados</span>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                        <button 
                            onClick={handleImport} 
                            disabled={selectedClients.length === 0 || isImporting}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            {isImporting && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isImporting ? 'Importando...' : 'Importar Selecionados'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
