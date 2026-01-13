
import React, { useState, useMemo } from 'react';
import { useMockData } from './hooks/useMockData';
import { Layout } from './components/Layout';
import { ClientsView } from './components/ClientsView';
import { ClientListView } from './components/ClientListView';
import { ClientDetailView } from './components/ClientDetailView';
import { OnboardingView } from './components/OnboardingView';
import { TasksView } from './components/TasksView';
import { SuccessView } from './components/SuccessView';
import { CommunicationView } from './components/CommunicationView';
import { SupportView } from './components/SupportView';
import { BvcView } from './components/BvcView';
import { SalesDashboardView } from './components/SalesDashboardView';
import { LeadsView } from './components/LeadsView';
import { SalesPipelineView } from './components/SalesPipelineView';
import { AutomationView } from './components/AutomationView';
import { FormsView } from './components/FormsView';
import { CalendarView } from './components/CalendarView';
import { ProcessModelsView } from './components/ProcessModelsView';
import { UsersView } from './components/UsersView';
import { AddClientWizard } from './components/AddClientWizard';
import { Client, Task, Ticket, BVC, Lead, OnboardingStatus, TaskStatus, TicketStatus, Document, Notification, NewClientData, LeadStage, LeadStatus, CommunicationLog, ClientStage, CommunicationType, User, UserRole, EmailTemplate, TaskPriority, ProcessModel } from './types';
import { AiAssistant } from './components/AiAssistant';
import { v4 as uuidv4 } from 'uuid';
import { ACCOUNTING_RESPONSIBLES } from './constants';
import { LoginView } from './components/LoginView';

const App: React.FC = () => {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const {
        clients, setClients,
        tasks, setTasks,
        tickets, setTickets,
        bvcs, setBvcs,
        leads, setLeads,
        automations,
        calendarEvents,
        processModels, setProcessModels,
        emailTemplates, setEmailTemplates,
        users, setUsers,
    } = useMockData();

    const [activeView, setActiveView] = useState('Clientes');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isAddingClient, setIsAddingClient] = useState(false);

    // Derived state must be declared BEFORE any conditional return to avoid React Error #310
    const selectedClientData = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);

    const handleSelectClient = (clientId: string) => {
        setSelectedClientId(clientId);
        setActiveView('ClientDetail');
    };

    const handleCloseDetailView = () => {
        setSelectedClientId(null);
        setActiveView('Lista de Clientes');
    };

    const handleStartAddClient = () => {
        setIsAddingClient(true);
        setActiveView('AddClient');
    };

    const handleFinishAddClient = () => {
        setIsAddingClient(false);
        setActiveView('Lista de Clientes');
    };

    const handleLogin = (identifier: string) => {
        const foundUser = users.find(u => 
            u.email.toLowerCase() === identifier.toLowerCase() || 
            u.name.toLowerCase() === identifier.toLowerCase()
        );

        if (foundUser && foundUser.isActive) {
            setCurrentUser(foundUser);
        } else {
            if (identifier.trim() !== '') {
                 const defaultUser = users[0]; 
                 setCurrentUser(defaultUser);
            }
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveView('Clientes');
    };

    // User Management Functions
    const addUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = { ...userData, id: uuidv4() };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (userData: User) => {
        setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: false } : u));
    };

    // Data manipulation functions
    const updateClientStatus = (clientId: string, status: OnboardingStatus) => {
        setClients(prev => prev.map(c => c.id === clientId ? { ...c, onboardingStatus: status } : c));
    };
    
    const updateClient = (clientId: string, updatedData: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updatedData } : c));
    };

    const bulkUpdateClients = (clientIds: string[], updatedData: Partial<Client>) => {
        setClients(prev => prev.map(c => clientIds.includes(c.id) ? { ...c, ...updatedData } : c));
    };

    const applyProcessToClient = (clientId: string, processModelId: string) => {
        const model = processModels.find(m => m.id === processModelId);
        if (!model) return;

        const newTasks = model.tasks.map(template => ({
            id: uuidv4(),
            title: template.title,
            clientId: clientId,
            dueDate: new Date(new Date().setDate(new Date().getDate() + template.dueDayOffset)),
            status: TaskStatus.ToDo,
            priority: TaskPriority.Medium,
        }));

        setTasks(prev => [...prev, ...newTasks]);
        setClients(prev => prev.map(c => c.id === clientId ? {
            ...c,
            appliedProcesses: [...(c.appliedProcesses || []), { processModelId, lastApplied: new Date() }]
        } : c));
        
        alert(`Fluxo "${model.name}" aplicado com sucesso! ${newTasks.length} tarefas geradas.`);
    };

    const addClient = (clientData: NewClientData) => {
        const clientId = uuidv4();
        
        const newDocuments: Document[] = clientData.importedDocs?.map(doc => ({
            ...doc,
            id: uuidv4(),
            clientId: clientId
        })) || [];

        const newLogs: CommunicationLog[] = clientData.importedLogs?.map(log => ({
            ...log,
            id: uuidv4(),
            clientId: clientId
        })) || [];

        const newClient: Client = {
            ...clientData,
            id: clientId,
            joinedDate: new Date(clientData.entryDate),
            inWarning: false,
            isBlocked: false,
            documents: newDocuments,
            accountManager: { name: 'Ana Pereira', email: 'ana.p@contador.com', phone: '(11) 91122-3344' },
            financials: [],
            onboardingStatus: clientData.status,
            stage: ClientStage.Onboarding, 
            npsScore: undefined,
            segmento: 'N/A',
            dominioCode: clientData.domainCode,
            warningMessage: '',
            tags: [],
            entry: '',
            accountingResponsible: '',
            appliedProcesses: [],
            communicationLogs: newLogs,
            clientHistory: [],
            technicalOpinions: []
        };
        setClients(prev => [...prev, newClient]);
    };

    const addTask = (task: Omit<Task, 'id' | 'status'>) => {
        const newTask = { ...task, id: uuidv4(), status: TaskStatus.ToDo };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };
    const updateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const addTicket = (ticket: Omit<Ticket, 'id' | 'reportedDate' | 'status'>) => {
        setTickets(prev => [...prev, { ...ticket, id: uuidv4(), reportedDate: new Date(), status: TicketStatus.Open }]);
    };
    const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    };
    const updateTicket = (ticket: Ticket) => {
        setTickets(prev => prev.map(t => t.id === ticket.id ? ticket : t));
    };
    const deleteTicket = (ticketId: string) => {
        setTickets(prev => prev.filter(t => t.id !== ticketId));
    };
    
    const addLead = (lead: Omit<Lead, 'id' | 'status' | 'stage' | 'lastContacted'>) => {
        setLeads(prev => [...prev, {...lead, id: uuidv4(), status: LeadStatus.Open, stage: LeadStage.New, lastContacted: new Date()}]);
    };

    const updateLeadStage = (leadId: string, stage: LeadStage) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage, lastContacted: new Date() } : l));
    };
    
     const updateLeadStatus = (leadId: string, status: LeadStatus) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
    };

    const addDocument = (doc: Omit<Document, 'id' | 'uploadDate'>) => {
        const newDoc = { ...doc, id: uuidv4(), uploadDate: new Date() };
        setClients(prev => prev.map(c => c.id === doc.clientId ? { ...c, documents: [...c.documents, newDoc] } : c));
    };
    
    const addBvc = (bvc: Omit<BVC, 'id'>) => {
        setBvcs(prev => [...prev, {...bvc, id: uuidv4()}]);
    };
    const updateBvc = (updatedBvc: BVC) => {
        setBvcs(prev => prev.map(b => b.id === updatedBvc.id ? updatedBvc : b));
    };
    const deleteBvc = (bvcId: string) => {
        setBvcs(prev => prev.filter(b => b.id !== bvcId));
    };

    // Communication Hub Functions
    const addEmailTemplate = (template: Omit<EmailTemplate, 'id'>) => {
        setEmailTemplates(prev => [...prev, { ...template, id: uuidv4() }]);
    };
    const updateEmailTemplate = (template: EmailTemplate) => {
        setEmailTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    };
    const deleteEmailTemplate = (templateId: string) => {
        setEmailTemplates(prev => prev.filter(t => t.id !== templateId));
    };
    
    const logCommunication = (log: Omit<CommunicationLog, 'id' | 'date'>) => {
        const newLog = { ...log, id: uuidv4(), date: new Date() };
        setClients(prev => prev.map(c => c.id === log.clientId ? { ...c, communicationLogs: [newLog, ...c.communicationLogs] } : c));
    };

    const addProcessModel = (model: Omit<ProcessModel, 'id'>) => {
        setProcessModels(prev => [...prev, { ...model, id: uuidv4() }]);
    };

    const updateProcessModel = (model: ProcessModel) => {
        setProcessModels(prev => prev.map(m => m.id === model.id ? model : m));
    };

    const deleteProcessModel = (modelId: string) => {
        setProcessModels(prev => prev.filter(m => m.id !== modelId));
    };
    
    const sendBulkCommunication = (clientIds: string[], subject: string, body: string) => {
        clientIds.forEach(clientId => {
            logCommunication({
                clientId,
                subject,
                content: body,
                type: CommunicationType.Email,
            });
        });
    };

    const renderView = () => {
        if (activeView === 'ClientDetail' && selectedClientData) {
            return <ClientDetailView
                client={selectedClientData}
                tasks={tasks.filter(t => t.clientId === selectedClientId)}
                tickets={tickets.filter(t => t.clientId === selectedClientId)}
                bvcs={bvcs.filter(bvc => bvc.clientId === selectedClientId)}
                onClose={handleCloseDetailView}
                addDocument={addDocument}
                updateTask={updateTask}
                addTask={addTask}
                clients={clients}
                logCommunication={logCommunication}
                updateClient={updateClient}
                addTicket={addTicket}
                updateTicketStatus={updateTicketStatus}
                updateTicket={updateTicket}
                deleteTicket={deleteTicket}
                processModels={processModels}
                applyProcessToClient={applyProcessToClient}
            />;
        }

        if (activeView === 'AddClient') {
            return <AddClientWizard addClient={addClient} onFinish={handleFinishAddClient} />;
        }

        switch (activeView) {
            case 'Clientes': return <ClientsView clients={clients} onSelectClient={handleSelectClient} onStartAddClient={handleStartAddClient} />;
            case 'Lista de Clientes': return <ClientListView clients={clients} onSelectClient={handleSelectClient} onStartAddClient={handleStartAddClient} bulkUpdateClients={bulkUpdateClients} accountingResponsibles={ACCOUNTING_RESPONSIBLES} addClient={addClient} />;
            case 'Onboarding': return <OnboardingView clients={clients} updateClientStatus={updateClientStatus} onSelectClient={handleSelectClient} onGoToModels={() => setActiveView('Modelos de Onboarding')} />;
            case 'Tarefas': return <TasksView tasks={tasks} clients={clients} onSelectClient={handleSelectClient} updateTask={updateTask} addTask={addTask} />;
            case 'Calendário': return <CalendarView tasks={tasks} clients={clients} calendarEvents={calendarEvents} addCalendarEvent={() => {}} updateCalendarEvent={() => {}} deleteCalendarEvent={() => {}} updateTask={updateTask} />;
            case 'Modelos de Onboarding': return <ProcessModelsView models={processModels} addProcessModel={addProcessModel} updateProcessModel={updateProcessModel} deleteProcessModel={deleteProcessModel} />;
            case 'Sucesso': return <SuccessView clients={clients} onSelectClient={handleSelectClient} />;
            case 'Comunicação': return <CommunicationView clients={clients} templates={emailTemplates} addTemplate={addEmailTemplate} updateTemplate={updateEmailTemplate} deleteTemplate={deleteEmailTemplate} sendBulkEmail={sendBulkCommunication} />;
            case 'Suporte': return <SupportView clients={clients} tickets={tickets} addTicket={addTicket} updateTicketStatus={updateTicketStatus} onSelectClient={handleSelectClient} updateTicket={updateTicket} deleteTicket={deleteTicket} />;
            case 'BVCs': return <BvcView clients={clients} bvcs={bvcs} addBvc={addBvc} updateBvc={updateBvc} deleteBvc={deleteBvc} onSelectClient={handleSelectClient} />;
            case 'Dashboard Vendas': return <SalesDashboardView leads={leads} tasks={tasks} calendarEvents={calendarEvents} />;
            case 'Leads': return <LeadsView leads={leads} addLead={addLead} updateLeadStage={updateLeadStage} updateLeadStatus={updateLeadStatus} />;
            case 'Pipeline': return <SalesPipelineView leads={leads} updateLeadStage={updateLeadStage} />;
            case 'Automações': return <AutomationView automations={automations} addAutomation={() => {}} toggleAutomation={() => {}} applyAutomations={() => 0} />;
            case 'Formulários': return <FormsView />;
            case 'Usuários': 
                if (currentUser?.role === UserRole.Admin) {
                    return <UsersView users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />;
                }
                return <ClientsView clients={clients} onSelectClient={handleSelectClient} onStartAddClient={handleStartAddClient} />;
            default: return <ClientsView clients={clients} onSelectClient={handleSelectClient} onStartAddClient={handleStartAddClient} />;
        }
    };
    
    const getClientName = (name: string) => clients.find(c => c.companyName.toLowerCase() === name.toLowerCase());
    const getLeadByName = (name: string) => leads.find(l => l.company.toLowerCase() === name.toLowerCase());

    // Authentication Check
    if (!currentUser) {
        return <LoginView onLogin={handleLogin} />;
    }

    return (
        <>
            <Layout activeView={activeView} setActiveView={setActiveView} isAddingClient={isAddingClient} onLogout={handleLogout} currentUser={currentUser}>
                {renderView()}
            </Layout>
            <AiAssistant
                clients={clients}
                leads={leads}
                tasks={tasks}
                bvcs={bvcs}
                getClientByName={getClientName}
                getLeadByName={getLeadByName}
                addTask={addTask}
                updateLeadStage={updateLeadStage}
            />
        </>
    );
};

export default App;
