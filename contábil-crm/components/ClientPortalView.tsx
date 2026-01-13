import React, { useState, useMemo } from 'react';
import { Client, Task, Ticket, TaskStatus, TicketStatus, Document, DocumentCategory, Notification } from '../types';
import { FinancialInsightsDashboard } from './FinancialInsightsDashboard';

interface ClientPortalViewProps {
  clients: Client[];
  tasks: Task[];
  tickets: Ticket[];
  notifications: Notification[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'reportedDate' | 'status'>) => void;
  addDocument: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
}

type PortalTab = 'dashboard' | 'documents' | 'support' | 'tasks' | 'notifications';

const ClientAddTicketModal: React.FC<{
    onClose: () => void;
    clientName: string;
    addTicketForClient: (title: string) => void;
}> = ({ onClose, clientName, addTicketForClient }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim()) return;
        addTicketForClient(title);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Abrir Novo Ticket de Suporte</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">Para: {clientName}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Descreva seu problema ou dúvida</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">Enviar Ticket</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UploadDocumentModal: React.FC<{
    onClose: () => void;
    clientName: string;
    onUpload: (fileName: string, fileSize: string) => void;
}> = ({ onClose, clientName, onUpload }) => {
    const [fileName, setFileName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!fileName.trim()) return;
        const size = (Math.random() * 3 + 0.5).toFixed(1); // Simulate file size
        onUpload(`${fileName}.pdf`, `${size} MB`);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Enviar Documento</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">Para: {clientName}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Esta é uma simulação de upload. Apenas digite o nome do arquivo.</p>
                     <div>
                        <label htmlFor="fileName" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome do Arquivo (sem extensão)</label>
                        <input type="text" id="fileName" value={fileName} onChange={e => setFileName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required placeholder="Ex: ExtratoBancario_Fevereiro"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
    icon: React.ReactNode;
}> = ({ label, isActive, onClick, count, icon }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
    >
        {icon}
        {label}
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-gold text-black' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200'}`}>{count}</span>
    </button>
);


export const ClientPortalView: React.FC<ClientPortalViewProps> = ({ clients, tasks, tickets, notifications, addTicket, addDocument }) => {
    const [selectedClientId, setSelectedClientId] = useState<string | null>(clients.length > 0 ? clients[0].id : null);
    const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
    const [isTicketModalOpen, setTicketModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);
    const clientTasks = useMemo(() => tasks.filter(t => t.clientId === selectedClientId && t.status !== TaskStatus.Done).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()), [tasks, selectedClientId]);
    const clientTickets = useMemo(() => tickets.filter(t => t.clientId === selectedClientId).sort((a,b) => b.reportedDate.getTime() - a.reportedDate.getTime()), [tickets, selectedClientId]);
    const clientDocuments = useMemo(() => selectedClient?.documents.filter(d => d.isPublic).sort((a,b) => b.uploadDate.getTime() - a.uploadDate.getTime()) || [], [selectedClient]);
    const clientNotifications = useMemo(() => notifications.filter(n => n.clientId === selectedClientId).sort((a,b) => b.date.getTime() - a.date.getTime()), [notifications, selectedClientId]);

    const handleAddTicket = (title: string) => {
        if (selectedClientId) addTicket({ title, clientId: selectedClientId });
    };

    const handleUploadDocument = (fileName: string, fileSize: string) => {
        if (selectedClientId) {
            addDocument({
                clientId: selectedClientId,
                name: fileName,
                // FIX: Property 'Others' does not exist on type 'typeof DocumentCategory'. Corrected to 'Outros'.
                category: DocumentCategory.Outros,
                fileSize: fileSize,
                isPublic: false,
            });
        }
    }

    const renderTabContent = () => {
        if (!selectedClient) return null;

        switch(activeTab) {
            case 'dashboard':
                const openTicketsCount = clientTickets.filter(t => t.status === TicketStatus.Open).length;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             {/* Quick Action Cards */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button onClick={() => setActiveTab('tasks')} className="bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-gold transition-colors">
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Tarefas Pendentes</p>
                                    <p className="text-black dark:text-white text-4xl font-bold mt-1">{clientTasks.length}</p>
                                </button>
                                <button onClick={() => setActiveTab('support')} className="bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-gold transition-colors">
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Tickets Abertos</p>
                                    <p className="text-black dark:text-white text-4xl font-bold mt-1">{openTicketsCount}</p>
                                </button>
                                <button onClick={() => setActiveTab('documents')} className="bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-gold transition-colors">
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Documentos Recentes</p>
                                    <p className="text-black dark:text-white text-4xl font-bold mt-1">{clientDocuments.length}</p>
                                </button>
                            </div>
                             {/* My Accountant Card */}
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <h4 className="font-semibold text-black dark:text-white mb-3">Meu Contador</h4>
                                <div className="flex items-center gap-3">
                                    <img src={`https://i.pravatar.cc/40?u=${selectedClient.accountManager.email}`} alt="Account Manager" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium text-black dark:text-white text-sm">{selectedClient.accountManager.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Contador(a) Responsável</p>
                                    </div>
                                </div>
                                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-3 space-y-1">
                                    <p>{selectedClient.accountManager.email}</p>
                                    <p>{selectedClient.accountManager.phone}</p>
                                </div>
                            </div>
                        </div>
                        <FinancialInsightsDashboard financialData={selectedClient.financials} clientName={selectedClient.companyName} />
                    </div>
                );
            case 'documents':
                return (
                    <div className="space-y-3">
                        {clientDocuments.length > 0 ? clientDocuments.map(doc => (
                           <div key={doc.id} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center">
                               <div><p className="font-medium text-black dark:text-white">{doc.name}</p><p className="text-sm text-zinc-500 dark:text-zinc-400">Publicado em: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p></div>
                               <a href="#" className="text-sm text-gold hover:underline">Baixar</a>
                           </div>
                       )) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhum documento compartilhado.</p>}
                   </div>
                );
            case 'support':
                return (
                     <div className="space-y-3">
                        <button onClick={() => setTicketModalOpen(true)} className="w-full bg-gold/10 text-gold font-semibold py-3 px-3 rounded-lg hover:bg-gold/20 mb-4 transition-colors">Abrir Novo Ticket</button>
                        {clientTickets.length > 0 ? clientTickets.map(ticket => (
                            <div key={ticket.id} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center">
                                <div><p className="font-medium text-black dark:text-white">{ticket.title}</p><p className="text-sm text-zinc-500 dark:text-zinc-400">Aberto em: {new Date(ticket.reportedDate).toLocaleDateString('pt-BR')}</p></div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-black ${ticket.status === TicketStatus.Open ? 'bg-amber-500' : 'bg-green-500'}`}>{ticket.status}</span>
                            </div>
                        )) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhum ticket de suporte encontrado.</p>}
                    </div>
                );
            case 'tasks':
                 return (
                    <div className="space-y-3">
                        {clientTasks.length > 0 ? clientTasks.map(task => {
                            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.Done;
                            const requiresUpload = task.title.toLowerCase().includes("enviar");
                            return (
                                <div key={task.id} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <div><p className="font-medium text-black dark:text-white">{task.title}</p><p className={`text-sm ${isOverdue ? 'text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}>Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p></div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-black ${task.status === TaskStatus.InProgress ? 'bg-amber-500' : 'bg-slate-500'}`}>{task.status}</span>
                                    </div>
                                    {requiresUpload && <button onClick={() => setUploadModalOpen(true)} className="mt-2 text-sm bg-gold/20 text-gold font-semibold py-1 px-3 rounded-md hover:bg-gold/30">Enviar Documento</button>}
                                </div>
                            );
                        }) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhuma tarefa pendente.</p>}
                    </div>
                );
            case 'notifications':
                const notificationIcons = {
                    task: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
                    document: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>,
                    ticket: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
                    general: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a1 1 0 000-2H4a1 1 0 000 2zm12 0h-3a1 1 0 100 2h3a1 1 0 100-2zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                };
                 return (
                    <div className="space-y-3">
                        {clientNotifications.length > 0 ? clientNotifications.map(notif => (
                            <div key={notif.id} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex items-start gap-4">
                                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>}
                                <div className={`flex-shrink-0 text-zinc-500 dark:text-zinc-400 ${notif.isRead ? 'ml-4' : ''}`}>
                                    {notificationIcons[notif.type]}
                                </div>
                                <div className="flex-grow">
                                    <p className={`text-sm ${notif.isRead ? 'text-zinc-500 dark:text-zinc-400' : 'text-black dark:text-white'}`}>{notif.text}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{new Date(notif.date).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        )) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhuma notificação encontrada.</p>}
                    </div>
                );
            default: return null;
        }
    }


    if (!selectedClient) {
        return <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800"><h3 className="text-xl font-semibold text-black dark:text-white">Portal do Cliente</h3><div className="text-center text-zinc-500 dark:text-zinc-400 py-8"><p>Nenhum cliente encontrado.</p></div></div>;
    }
    
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h1 className="text-3xl font-bold text-black dark:text-white">Portal do Cliente</h1>
                <div className="flex items-center gap-2">
                    <label htmlFor="client_selector" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Visualizando como:</label>
                    <select id="client_selector" value={selectedClientId ?? ''} onChange={e => setSelectedClientId(e.target.value)} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 pl-3 pr-8 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                        {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                 <h2 className="text-2xl font-bold text-black dark:text-white">Olá, {selectedClient.name}!</h2>
                 <p className="text-zinc-600 dark:text-zinc-300">Bem-vindo(a) ao seu portal. Aqui você pode acompanhar suas solicitações, tarefas e a saúde financeira da sua empresa.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <nav className="flex gap-2">
                    <TabButton label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} count={0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} />
                    <TabButton label="Tarefas" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} count={clientTasks.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>} />
                    <TabButton label="Suporte" isActive={activeTab === 'support'} onClick={() => setActiveTab('support')} count={clientTickets.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>} />
                    <TabButton label="Documentos" isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} count={clientDocuments.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>} />
                    <TabButton label="Notificações" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} count={clientNotifications.filter(n => !n.isRead).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>} />
                </nav>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 min-h-[400px]">
                {renderTabContent()}
            </div>
            

            {isTicketModalOpen && <ClientAddTicketModal onClose={() => setTicketModalOpen(false)} clientName={selectedClient.companyName} addTicketForClient={handleAddTicket} />}
            {isUploadModalOpen && <UploadDocumentModal onClose={() => setUploadModalOpen(false)} clientName={selectedClient.companyName} onUpload={handleUploadDocument} />}
        </div>
    );
};