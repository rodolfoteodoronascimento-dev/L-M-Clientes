
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Client, Task, Ticket, BVC, Lead, Automation, CalendarEvent, ProcessModel, Notification, EmailTemplate, User,
    OnboardingStatus, ClientStage, ClientPlan, TaxRegime, TaskStatus, TicketStatus, LeadStage, LeadStatus, LeadSource,
    DocumentCategory, AcquisitionChannel, ProcessFrequency, AutomationTriggerType, AutomationActionType, TaskPriority, CommunicationType, UserRole, HistoryEventType, OpinionType
} from '../types';

const generateFinancials = () => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = d.toLocaleString('pt-BR', { month: 'short' });
        const revenue = Math.floor(Math.random() * (25000 - 10000 + 1)) + 10000;
        const expenses = Math.floor(revenue * (Math.random() * (0.7 - 0.4) + 0.4));
        const profit = revenue - expenses;
        data.push({ month: month.charAt(0).toUpperCase() + month.slice(1), revenue, expenses, profit });
    }
    return data;
}

const initialClients: Client[] = [
    {
        id: '1', name: 'Carlos Silva', companyName: 'Inovatech Soluções', cnpj: '12.345.678/0001-90', email: 'carlos.silva@inovatech.com', phone: '(11) 98765-4321',
        joinedDate: new Date('2023-01-15'), onboardingStatus: OnboardingStatus.Active, stage: ClientStage.Operacao, plan: ClientPlan.DecolaEmpresa, taxRegime: TaxRegime.LucroPresumido,
        accountManager: { name: 'Ana Pereira', email: 'ana.p@contador.com', phone: '(11) 91122-3344' }, npsScore: 9, inWarning: false, isBlocked: false, warningMessage: '',
        documents: [
            { id: 'doc1', clientId: '1', name: 'Contrato Social.pdf', uploadDate: new Date('2023-01-15'), category: DocumentCategory.Contratos, fileSize: '1.2 MB', isPublic: true },
            { id: 'doc2', clientId: '1', name: 'Balanço 2023.pdf', uploadDate: new Date('2024-02-10'), category: DocumentCategory.Contabil, fileSize: '800 KB', isPublic: true },
        ],
        financials: generateFinancials(), tags: ['tecnologia', 'saas'], state: "SP", city: "São Paulo", acquisitionChannel: AcquisitionChannel.Indicação, dominioCode: '101', category: 'Serviços', fee: '2500', entry: 'Troca', group: 'A', segmento: 'Tecnologia', accountingResponsible: 'Mariana Lima', appliedProcesses: [], 
        communicationLogs: [
            { id: 'comm1', clientId: '1', date: new Date(new Date().setDate(new Date().getDate() - 5)), type: CommunicationType.Email, subject: 'Revisão Fiscal', content: 'Email enviado com o balancete.' },
            { id: 'comm2', clientId: '1', date: new Date(new Date().setDate(new Date().getDate() - 12)), type: CommunicationType.Chamada, subject: 'Dúvidas sobre IRPF', content: 'Ligação para tirar dúvidas.' },
        ],
        clientHistory: [
            { id: 'h1', clientId: '1', date: new Date('2023-01-15'), type: HistoryEventType.General, description: 'Cliente iniciou na base.', author: 'Ana Pereira' },
            { id: 'h2', clientId: '1', date: new Date('2023-06-10'), type: HistoryEventType.Praise, description: 'Elogiou a agilidade no fechamento da folha.', author: 'Lucas Mendes' }
        ],
        technicalOpinions: [
            { id: 'op1', clientId: '1', date: new Date('2023-02-20'), type: OpinionType.PTI, title: 'Análise de Enquadramento', content: 'Cliente com potencial para Lucro Real no próximo exercício devido ao aumento de despesas dedutíveis.', author: 'Mariana Lima', tags: ['Tributário', 'Planejamento'] }
        ]
    },
    {
        id: '2', name: 'Mariana Costa', companyName: 'Nexus Construtora', cnpj: '23.456.789/0001-00', email: 'mariana.costa@nexus.com', phone: '(21) 91234-5678',
        joinedDate: new Date('2022-11-20'), onboardingStatus: OnboardingStatus.Active, stage: ClientStage.Operacao, plan: ClientPlan.DecolaLucro, taxRegime: TaxRegime.LucroReal,
        accountManager: { name: 'João Santos', email: 'joao.s@contador.com', phone: '(11) 92233-4455' }, npsScore: 7, inWarning: true, isBlocked: false, warningMessage: 'Atraso na entrega de documentos fiscais.',
        documents: [], financials: generateFinancials(), tags: ['construção', 'grande-porte'], state: "RJ", city: "Rio de Janeiro", acquisitionChannel: AcquisitionChannel.Feiras, dominioCode: '102', category: 'Construção', fee: '5000', entry: 'Troca', group: 'A', segmento: 'Construção Civil', accountingResponsible: 'Mariana Lima', appliedProcesses: [], 
        communicationLogs: [
            { id: 'comm3', clientId: '2', date: new Date(new Date().setDate(new Date().getDate() - 20)), type: CommunicationType.Reunião, subject: 'Planejamento', content: 'Reunião de planejamento.' },
        ],
        clientHistory: [
            { id: 'h3', clientId: '2', date: new Date('2024-01-10'), type: HistoryEventType.Complaint, description: 'Reclamou da demora no envio da guia de ISS.', author: 'João Santos' },
            { id: 'h4', clientId: '2', date: new Date('2024-03-01'), type: HistoryEventType.RelevantFact, description: 'Cliente abriu nova filial em SP.', author: 'Ana Pereira' }
        ],
        technicalOpinions: [
            { id: 'op2', clientId: '2', date: new Date('2024-01-15'), type: OpinionType.PTC, title: 'Parecer sobre Retenções', content: 'Esclarecimento formal enviado ao cliente sobre as retenções de INSS em notas fiscais de empreitada global.', author: 'Mariana Lima', tags: ['Retenções', 'INSS'] }
        ]
    },
    {
        id: '3', name: 'Pedro Almeida', companyName: 'Café Saboroso', cnpj: '34.567.890/0001-11', email: 'pedro.almeida@cafesaboroso.com', phone: '(31) 95555-4444',
        joinedDate: new Date('2023-08-05'), onboardingStatus: OnboardingStatus.Active, stage: ClientStage.Adocao, plan: ClientPlan.DecolaObrigacoes, taxRegime: TaxRegime.SimplesNacional,
        accountManager: { name: 'Ana Pereira', email: 'ana.p@contador.com', phone: '(11) 91122-3344' }, npsScore: 10, inWarning: false, isBlocked: false, warningMessage: '',
        documents: [], financials: generateFinancials(), tags: ['varejo', 'alimentício'], state: "MG", city: "Belo Horizonte", acquisitionChannel: AcquisitionChannel.Website, dominioCode: '103', category: 'Varejo', fee: '1200', entry: 'Abertura', group: 'B', segmento: 'Alimentício', accountingResponsible: 'Lucas Mendes', appliedProcesses: [], communicationLogs: [],
        clientHistory: [], technicalOpinions: []
    },
    {
        id: '4', name: 'Lucia Ferraz', companyName: 'Digital Way', cnpj: '45.678.901/0001-22', email: 'lucia.ferraz@digitalway.com', phone: '(48) 98877-6655',
        joinedDate: new Date(), onboardingStatus: OnboardingStatus.Onboarding, stage: ClientStage.Onboarding, plan: ClientPlan.DecolaEmpresa, taxRegime: TaxRegime.LucroPresumido,
        accountManager: { name: 'Sofia Ribeiro', email: 'sofia.r@contador.com', phone: '(11) 93344-5566' }, inWarning: false, isBlocked: false, warningMessage: '',
        documents: [], financials: [], tags: ['marketing-digital'], state: "SC", city: "Florianópolis", acquisitionChannel: AcquisitionChannel.Anúncios, dominioCode: '104', category: 'Serviços', fee: '2800', entry: 'Abertura', group: 'B', segmento: 'Marketing', accountingResponsible: 'Lucas Mendes', appliedProcesses: [], communicationLogs: [],
        clientHistory: [], technicalOpinions: []
    },
     {
        id: '5', name: 'Fernando Martins', companyName: 'LogiExpress', cnpj: '56.789.012/0001-33', email: 'fernando.m@logiexpress.com', phone: '(51) 99988-7766',
        joinedDate: new Date('2021-06-18'), onboardingStatus: OnboardingStatus.Churned, stage: ClientStage.Operacao, plan: ClientPlan.DecolaObrigacoes, taxRegime: TaxRegime.LucroPresumido,
        accountManager: { name: 'João Santos', email: 'joao.s@contador.com', phone: '(11) 92233-4455' }, npsScore: 4, inWarning: false, isBlocked: true, warningMessage: 'Cliente encerrou contrato.',
        documents: [], financials: generateFinancials(), tags: ['logística'], state: "RS", city: "Porto Alegre", acquisitionChannel: AcquisitionChannel.Outros, dominioCode: '105', category: 'Transporte', fee: '1500', entry: 'Troca', group: 'C', segmento: 'Logística', accountingResponsible: 'Mariana Lima', appliedProcesses: [], communicationLogs: [],
        clientHistory: [], technicalOpinions: []
    },
];

const initialTasks: Task[] = [
    { id: 't1', title: 'Revisar balancete de Dezembro', clientId: '1', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), status: TaskStatus.InProgress, priority: TaskPriority.Medium },
    { id: 't2', title: 'Coletar documentos para imposto de renda', clientId: '2', dueDate: new Date(new Date().setDate(new Date().getDate() - 5)), status: TaskStatus.ToDo, priority: TaskPriority.High },
    { id: 't3', title: 'Enviar guias do Simples Nacional', clientId: '3', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)), status: TaskStatus.ToDo, priority: TaskPriority.Medium },
    { id: 't4', title: 'Realizar reunião de onboarding', clientId: '4', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), status: TaskStatus.InProgress, priority: TaskPriority.High },
    { id: 't5', title: 'Finalizar cálculo da folha de pagamento', clientId: '1', dueDate: new Date('2024-03-28'), status: TaskStatus.Done, priority: TaskPriority.Low },
];

const initialTickets: Ticket[] = [
    { id: 'tk1', title: 'Dúvida sobre emissão de nota fiscal', clientId: '1', reportedDate: new Date(new Date().setDate(new Date().getDate() - 1)), status: TicketStatus.Open },
    { id: 'tk2', title: 'Problema no acesso ao portal do cliente', clientId: '3', reportedDate: new Date(new Date().setDate(new Date().getDate() - 3)), status: TicketStatus.Open },
    { id: 'tk3', title: 'Solicitação de 2ª via de boleto', clientId: '2', reportedDate: new Date('2024-03-25'), status: TicketStatus.Closed },
];

const initialBvcs: BVC[] = [
    { id: 'bvc1', clientId: '1', visitDate: new Date('2024-02-20'), consultant: 'Ana Pereira', objective: 'Alinhamento estratégico 2024', summary: 'Cliente satisfeito com os resultados. Planejamos otimização fiscal para o próximo trimestre.' },
    { id: 'bvc2', clientId: '2', visitDate: new Date('2024-03-10'), consultant: 'João Santos', objective: 'Resolver pendências documentais', summary: 'Discutimos os documentos em atraso e estabelecemos um novo prazo. Cliente se comprometeu a enviar até o final da semana.' },
];

const initialLeads: Lead[] = [
    { id: 'l1', name: 'Juliana Paes', company: 'Artesanato Criativo', value: 12000, stage: LeadStage.Proposal, status: LeadStatus.Open, source: LeadSource.Website, lastContacted: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'l2', name: 'Roberto Lima', company: 'RL Tech', value: 35000, stage: LeadStage.Qualified, status: LeadStatus.Open, source: LeadSource.Referral, lastContacted: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { id: 'l3', name: 'Beatriz Souza', company: 'Consultoria Prime', value: 25000, stage: LeadStage.New, status: LeadStatus.Open, source: LeadSource.Event, lastContacted: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 'l4', name: 'André Marques', company: 'AM Transportes', value: 18000, stage: LeadStage.Negotiation, status: LeadStatus.Won, source: LeadSource.ColdCall, lastContacted: new Date('2024-03-15') },
];

const initialAutomations: Automation[] = [
    { id: 'auto1', name: 'Mover Lead Inativo para Nutrição', enabled: true, trigger: { type: AutomationTriggerType.LeadInactivity, days: 14 }, action: { type: AutomationActionType.MoveLeadStage, stage: LeadStage.Nurturing } },
    { id: 'auto2', name: 'Criar Tarefa de Boas-Vindas', enabled: true, trigger: { type: AutomationTriggerType.ClientStatusChanged, status: OnboardingStatus.Onboarding }, action: { type: AutomationActionType.CreateTask, title: 'Ligar para dar as boas-vindas ao novo cliente', daysUntilDue: 2 } },
];

const initialCalendarEvents: CalendarEvent[] = [
    { id: 'ce1', title: 'Reunião de alinhamento com Inovatech', start: new Date(new Date().setHours(10, 0, 0, 0)), end: new Date(new Date().setHours(11, 0, 0, 0)), color: 'blue' },
    { id: 'ce2', title: 'Prazo final: Entrega IRPF', start: new Date(new Date().setDate(new Date().getDate() + 5)), end: new Date(new Date().setDate(new Date().getDate() + 5)), color: 'red' },
];

const initialProcessModels: ProcessModel[] = [
    { id: 'pm1', name: 'Fechamento Mensal - Simples Nacional', frequency: ProcessFrequency.Monthly, description: 'Processo padrão para fechamento de empresas do Simples Nacional.', tasks: [{id: uuidv4(), title: 'Enviar DAS', dueDayOffset: 10}, {id: uuidv4(), title: 'Conciliar extratos bancários', dueDayOffset: 5}] },
    { id: 'pm2', name: 'Folha de Pagamento', frequency: ProcessFrequency.Monthly, description: 'Cálculo e envio de holerites e guias da folha.', tasks: [{id: uuidv4(), title: 'Calcular folha', dueDayOffset: 25}, {id: uuidv4(), title: 'Enviar holerites', dueDayOffset: 28}] },
];

const initialNotifications: Notification[] = [
    { id: 'n1', clientId: '1', date: new Date(new Date().setDate(new Date().getDate() - 1)), text: 'Sua tarefa "Revisar balancete de Dezembro" está próxima do vencimento.', isRead: false, type: 'task' },
    { id: 'n2', clientId: '1', date: new Date('2024-02-10'), text: 'O documento "Balanço 2023.pdf" foi compartilhado com você.', isRead: true, type: 'document' },
];

const initialEmailTemplates: EmailTemplate[] = [
    {id: 'et1', name: 'Boas-vindas', subject: 'Bem-vindo(a) à nossa contabilidade, {NOME_EMPRESA}!', body: 'Olá, {CLIENTE_NOME}! Estamos muito felizes em ter você conosco.'},
    {id: 'et2', name: 'Lembrete de Documentos', subject: 'Lembrete: Envio de documentos pendentes', body: 'Olá, {CLIENTE_NOME}. Gostaríamos de lembrar sobre o envio dos documentos para o fechamento deste mês. Qualquer dúvida, estamos à disposição!'},
];

const initialUsers: User[] = [
    { id: 'u1', name: 'Ana Pereira', email: 'ana.p@contador.com', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d', isActive: true },
    { id: 'u2', name: 'João Santos', email: 'joao.s@contador.com', role: UserRole.Manager, avatar: 'https://i.pravatar.cc/40?u=12345', isActive: true },
    { id: 'u3', name: 'Lucas Mendes', email: 'lucas.m@contador.com', role: UserRole.Analyst, avatar: 'https://i.pravatar.cc/40?u=67890', isActive: true },
];


export const useMockData = () => {
    const [clients, setClients] = useState(initialClients);
    const [tasks, setTasks] = useState(initialTasks);
    const [tickets, setTickets] = useState(initialTickets);
    const [bvcs, setBvcs] = useState(initialBvcs);
    const [leads, setLeads] = useState(initialLeads);
    const [automations, setAutomations] = useState(initialAutomations);
    const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
    const [processModels, setProcessModels] = useState(initialProcessModels);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [emailTemplates, setEmailTemplates] = useState(initialEmailTemplates);
    const [users, setUsers] = useState(initialUsers);

    return {
        clients, setClients,
        tasks, setTasks,
        tickets, setTickets,
        bvcs, setBvcs,
        leads, setLeads,
        automations, setAutomations,
        calendarEvents, setCalendarEvents,
        processModels, setProcessModels,
        notifications, setNotifications,
        emailTemplates, setEmailTemplates,
        users, setUsers
    };
};
