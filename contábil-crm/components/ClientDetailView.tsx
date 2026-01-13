
import React, { useState } from 'react';
import { Client, Task, Ticket, BVC, Document, OnboardingStatus, ClientStage, CommunicationLog, CommunicationType, TaxRegime, ClientPlan, AcquisitionChannel, TicketStatus, ClientHistoryEvent, TechnicalOpinion, ProcessModel } from '../types';
import { STATUS_COLORS } from '../constants';
import { ClientDocumentsView } from './ClientDocumentsView';
import { TasksView } from './TasksView';
import { SupportView } from './SupportView';
import { BvcView } from './BvcView';
import { ClientHistoryView } from './ClientHistoryView';
import { TechnicalOpinionsView } from './TechnicalOpinionsView';
import { LogCommunicationModal } from './modals/LogCommunicationModal';
import { EditClientInfoModal } from './modals/EditClientModals';
import { ApplyProcessModal } from './modals/ApplyProcessModal';
import { v4 as uuidv4 } from 'uuid';

interface ClientDetailViewProps {
    client: Client;
    tasks: Task[];
    tickets: Ticket[];
    bvcs: BVC[];
    clients: Client[];
    onClose: () => void;
    addDocument: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
    updateTask: (updatedTask: Task) => void;
    addTask: (task: Omit<Task, 'id' | 'status'>) => void;
    logCommunication: (log: Omit<CommunicationLog, 'id' | 'date'>) => void;
    updateClient: (clientId: string, updatedData: Partial<Client>) => void;
    addTicket: (ticket: Omit<Ticket, 'id' | 'reportedDate' | 'status'>) => void;
    updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
    updateTicket: (ticket: Ticket) => void;
    deleteTicket: (ticketId: string) => void;
    processModels: ProcessModel[];
    applyProcessToClient: (clientId: string, processModelId: string) => void;
}

type DetailTab = 'overview' | 'documents' | 'tasks' | 'support' | 'bvcs' | 'communication' | 'history' | 'technical';

const InfoItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-md font-semibold text-black dark:text-white truncate">{value || '-'}</p>
    </div>
);

const DetailSection: React.FC<{ title: string; onEdit: () => void; children: React.ReactNode; }> = ({ title, onEdit, children }) => (
    <div className="bg-zinc-100 dark:bg-black/20 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">{title}</h4>
            <button onClick={onEdit} className="text-sm text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                Editar
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const CommunicationLogItem: React.FC<{ log: CommunicationLog }> = ({ log }) => {
    const icons = {
        [CommunicationType.Email]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>,
        [CommunicationType.Chamada]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
        [CommunicationType.Reunião]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
        [CommunicationType.Outro]: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
    };
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <span className="p-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full">{icons[log.type]}</span>
                <div className="flex-grow w-px bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
            <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{log.date.toLocaleString('pt-BR')}</p>
                <p className="font-semibold text-black dark:text-white">{log.subject}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{log.content}</p>
            </div>
        </div>
    );
};

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, tasks, tickets, bvcs, clients, onClose, addDocument, updateTask, addTask, logCommunication, updateClient, addTicket, updateTicketStatus, updateTicket, deleteTicket, processModels, applyProcessToClient }) => {
    const [activeTab, setActiveTab] = useState<DetailTab>('overview');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<'contact' | 'management' | 'accounting' | null>(null);

    const handleLogCommunication = (logData: Omit<CommunicationLog, 'id' | 'clientId' | 'date'>) => {
        logCommunication({ ...logData, clientId: client.id });
        setIsLogModalOpen(false);
    };
    
    const handleSave = (updatedData: Partial<Client>) => {
        updateClient(client.id, updatedData);
        setEditingSection(null);
    };

    const handleAddHistory = (event: Omit<ClientHistoryEvent, 'id' | 'date'>) => {
        const newEvent: ClientHistoryEvent = {
            ...event,
            id: uuidv4(),
            date: new Date(),
            clientId: client.id
        };
        const updatedHistory = [...(client.clientHistory || []), newEvent];
        updateClient(client.id, { clientHistory: updatedHistory });
    };

    const handleAddOpinion = (opinion: Omit<TechnicalOpinion, 'id' | 'date'>) => {
        const newOpinion: TechnicalOpinion = {
            ...opinion,
            id: uuidv4(),
            date: new Date(),
            clientId: client.id
        };
        const updatedOpinions = [...(client.technicalOpinions || []), newOpinion];
        updateClient(client.id, { technicalOpinions: updatedOpinions });
    };

    const TabButton: React.FC<{ tab: DetailTab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
            {label}
        </button>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'history':
                return <ClientHistoryView history={client.clientHistory || []} onAddHistory={handleAddHistory} />;
            case 'technical':
                return <TechnicalOpinionsView opinions={client.technicalOpinions || []} onAddOpinion={handleAddOpinion} />;
            case 'documents':
                return <ClientDocumentsView documents={client.documents} clientId={client.id} onAddDocument={addDocument} />;
            case 'tasks':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setIsApplyModalOpen(true)}
                                className="bg-primary/20 text-black dark:text-white border border-primary/50 font-bold px-4 py-2 rounded-lg hover:bg-primary/30 transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                Aplicar Fluxo de Trabalho
                            </button>
                        </div>
                        <TasksView tasks={tasks} clients={clients} onSelectClient={() => {}} updateTask={updateTask} addTask={(task) => addTask({...task, clientId: client.id})} />
                    </div>
                );
            case 'support':
                return <SupportView tickets={tickets} clients={clients} onSelectClient={()=>{}} addTicket={addTicket} updateTicketStatus={updateTicketStatus} updateTicket={updateTicket} deleteTicket={deleteTicket} />;
            case 'bvcs':
                return <BvcView bvcs={bvcs} clients={clients} onSelectClient={()=>{}} addBvc={()=>{}} updateBvc={()=>{}} deleteBvc={()=>{}} />;
             case 'communication':
                return (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setIsLogModalOpen(true)} className="bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                                Registrar Contato
                            </button>
                        </div>
                        <div className="space-y-6">
                            {client.communicationLogs.map(log => <CommunicationLogItem key={log.id} log={log} />)}
                            {client.communicationLogs.length === 0 && <p className="text-zinc-500 dark:text-zinc-500 text-center py-8">Nenhum registro de comunicação encontrado.</p>}
                        </div>
                    </div>
                );
            case 'overview':
            default:
                 return (
                    <div className="space-y-6">
                        <DetailSection title="Informações de Contato" onEdit={() => setEditingSection('contact')}>
                           <InfoItem label="Responsável" value={client.name} />
                           <InfoItem label="Telefone" value={client.phone} />
                           <InfoItem label="Email" value={client.email} />
                           <InfoItem label="Localização" value={`${client.city}, ${client.state}`} />
                        </DetailSection>

                        <DetailSection title="Informações Gerenciais" onEdit={() => setEditingSection('management')}>
                            <InfoItem label="Plano" value={client.plan} />
                            <InfoItem label="Honorário" value={parseFloat(client.fee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                            <InfoItem label="Etapa" value={<span className="capitalize">{client.stage}</span>} />
                            <InfoItem label="Status Onboarding" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[client.onboardingStatus]}`}>{client.onboardingStatus}</span>} />
                        </DetailSection>

                        <DetailSection title="Informações Contábeis, Fiscais e Pessoais" onEdit={() => setEditingSection('accounting')}>
                            <InfoItem label="CNPJ" value={client.cnpj} />
                            <InfoItem label="Regime Tributário" value={client.taxRegime} />
                            <InfoItem label="Responsável Contábil" value={client.accountingResponsible} />
                             <InfoItem label="Grupo" value={client.group} />
                        </DetailSection>
                    </div>
                );
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <button onClick={onClose} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Voltar para a lista
                    </button>
                    <h1 className="text-3xl font-bold text-black dark:text-white">{client.companyName}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Cliente desde {new Date(client.joinedDate).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="border-b border-zinc-200 dark:border-zinc-700">
                    <nav className="p-2 flex gap-2 overflow-x-auto pb-4 sm:pb-2">
                       <TabButton tab="overview" label="Visão Geral" />
                       <TabButton tab="history" label="Histórico & Fatos" />
                       <TabButton tab="technical" label="Pareceres Técnicos" />
                       <TabButton tab="documents" label="Documentos" />
                       <TabButton tab="tasks" label="Tarefas" />
                       <TabButton tab="support" label="Suporte" />
                       <TabButton tab="bvcs" label="BVCs" />
                       <TabButton tab="communication" label="Comunicação" />
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
            
            {editingSection && (
                <EditClientInfoModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    onSave={handleSave}
                    client={client}
                    section={editingSection}
                />
            )}

            {isApplyModalOpen && (
                <ApplyProcessModal
                    isOpen={isApplyModalOpen}
                    onClose={() => setIsApplyModalOpen(false)}
                    clientId={client.id}
                    processModels={processModels}
                    clientAppliedProcesses={client.appliedProcesses || []}
                    applyProcessToClient={applyProcessToClient}
                />
            )}

            <LogCommunicationModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSave={handleLogCommunication}
            />
        </div>
    );
};
