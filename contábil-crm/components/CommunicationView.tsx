import React, { useState, useMemo } from 'react';
import { Client, EmailTemplate, ClientPlan, TaxRegime } from '../types';
import { EmailTemplateModal } from './modals/EmailTemplateModal';

interface CommunicationViewProps {
    clients: Client[];
    templates: EmailTemplate[];
    addTemplate: (template: Omit<EmailTemplate, 'id'>) => void;
    updateTemplate: (template: EmailTemplate) => void;
    deleteTemplate: (templateId: string) => void;
    sendBulkEmail: (clientIds: string[], subject: string, body: string) => void;
}

type ActiveTab = 'send' | 'templates';

export const CommunicationView: React.FC<CommunicationViewProps> = ({ clients, templates, addTemplate, updateTemplate, deleteTemplate, sendBulkEmail }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('send');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    // State for Send Tab
    const [filters, setFilters] = useState({ plan: 'all', taxRegime: 'all' });
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredClients = useMemo(() => {
        return clients.filter(c => {
            const planMatch = filters.plan === 'all' || c.plan === filters.plan;
            const regimeMatch = filters.taxRegime === 'all' || c.taxRegime === filters.taxRegime;
            const searchMatch = searchTerm === '' || c.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            return planMatch && regimeMatch && searchMatch;
        });
    }, [clients, filters, searchTerm]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedClients(filteredClients.map(c => c.id));
        } else {
            setSelectedClients([]);
        }
    };
    
    const handleSelectClient = (clientId: string) => {
        setSelectedClients(prev => prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]);
    };

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId);
        if (templateId) {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                setSubject(template.subject);
                setBody(template.body);
            }
        } else {
            setSubject('');
            setBody('');
        }
    };

    const handleSendEmail = () => {
        if (selectedClients.length === 0 || !subject || !body) {
            alert('Por favor, selecione destinatários e preencha o assunto e corpo do email.');
            return;
        }
        sendBulkEmail(selectedClients, subject, body);
        alert(`${selectedClients.length} e-mails (simulados) foram enviados e registrados.`);
        // Reset state
        setSelectedClients([]);
        setSelectedTemplateId('');
        setSubject('');
        setBody('');
    };


    const openAddModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(true);
    };

    const openEditModal = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };
    
    const handleSaveTemplate = (templateData: Omit<EmailTemplate, 'id'> | EmailTemplate) => {
        if ('id' in templateData) {
            updateTemplate(templateData);
        } else {
            addTemplate(templateData);
        }
        setIsModalOpen(false);
    };

    const handleDeleteTemplate = (templateId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este modelo?")) {
            deleteTemplate(templateId);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Hub de Comunicação</h1>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg">
                <div className="border-b border-zinc-200 dark:border-zinc-700">
                    <nav className="p-2 flex gap-2">
                        <button onClick={() => setActiveTab('send')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'send' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}>Enviar Comunicado</button>
                        <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'templates' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}>Modelos de E-mail</button>
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'send' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side: Client Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-black dark:text-white">1. Selecione os Destinatários</h3>
                                <div className="flex gap-4">
                                    <select value={filters.plan} onChange={e => setFilters(f => ({...f, plan: e.target.value}))} className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white">
                                        <option value="all">Todos os Planos</option>
                                        {Object.values(ClientPlan).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <select value={filters.taxRegime} onChange={e => setFilters(f => ({...f, taxRegime: e.target.value}))} className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white">
                                        <option value="all">Todos os Regimes</option>
                                        {Object.values(TaxRegime).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white"/>
                                <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg h-80 overflow-y-auto">
                                    <div className="p-3 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                                        <label className="flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-300">
                                            <input type="checkbox" onChange={handleSelectAll} checked={selectedClients.length === filteredClients.length && filteredClients.length > 0} className="rounded text-primary focus:ring-primary"/>
                                            Selecionar Todos ({selectedClients.length}/{filteredClients.length})
                                        </label>
                                    </div>
                                    <div className="divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                                    {filteredClients.map(client => (
                                        <label key={client.id} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50">
                                            <input type="checkbox" checked={selectedClients.includes(client.id)} onChange={() => handleSelectClient(client.id)} className="rounded text-primary focus:ring-primary"/>
                                            <span className="text-black dark:text-white">{client.companyName}</span>
                                        </label>
                                    ))}
                                    </div>
                                </div>
                            </div>
                            {/* Right Side: Message Composer */}
                            <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-black dark:text-white">2. Escreva sua Mensagem</h3>
                                 <select value={selectedTemplateId} onChange={e => handleTemplateSelect(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white">
                                     <option value="">Usar um modelo...</option>
                                     {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                 </select>
                                 <input type="text" placeholder="Assunto" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white" />
                                 <textarea placeholder="Corpo do e-mail..." value={body} onChange={e => setBody(e.target.value)} rows={10} className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white"/>
                                 <p className="text-xs text-zinc-500 dark:text-zinc-400">Dica: Use {'{CLIENTE_NOME}'} para personalizar.</p>
                                 <button onClick={handleSendEmail} className="w-full bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold py-3 rounded-lg hover:from-primary-light hover:to-primary transition-all transform active:scale-95">
                                     Enviar para {selectedClients.length} Cliente(s)
                                 </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'templates' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-black dark:text-white">Seus Modelos de E-mail</h3>
                                <button onClick={openAddModal} className="bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm hover:from-primary-light hover:to-primary transition-all transform active:scale-95">Novo Modelo</button>
                            </div>
                            {templates.map(template => (
                                <div key={template.id} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-black dark:text-white">{template.name}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{template.subject}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(template)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                        <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && <EmailTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTemplate} templateToEdit={editingTemplate} />}
        </div>
    );
};