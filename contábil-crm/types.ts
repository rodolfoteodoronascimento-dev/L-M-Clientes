
// types.ts (Updated sections)

export enum OnboardingStatus {
    Prospect = 'Prospect',
    Onboarding = 'Onboarding',
    SetupComplete = 'Setup Completo',
    Active = 'Ativo',
    Churned = 'Churned',
}

export enum ClientStage {
    Onboarding = 'onboarding',
    Societario = 'societário',
    Adocao = 'adoção',
    Operacao = 'operação',
}

export enum ClientPlan {
    DecolaObrigacoes = 'Decola Obrigações',
    DecolaEmpresa = 'Decola Empresa',
    DecolaLucro = 'Decola Lucro',
}

export enum TaxRegime {
    SimplesNacional = 'Simples Nacional',
    LucroPresumido = 'Lucro Presumido',
    LucroReal = 'Lucro Real',
    Indefinido = 'Indefinido',
}

export enum AcquisitionChannel {
    Indicação = 'Indicação',
    Website = 'Website',
    Feiras = 'Feiras',
    Anúncios = 'Anúncios',
    Outros = 'Outros',
}

export enum EntryProcess {
    Abertura = 'Abertura de Empresa',
    TrocaContador = 'Troca de Contador',
}

export enum TaskStatus {
    ToDo = 'A fazer',
    InProgress = 'Andamento',
    Done = 'Tarefa Feita',
}

export enum TaskPriority {
    High = 'Alta',
    Medium = 'Média',
    Low = 'Baixa',
}

export enum TicketStatus {
    Open = 'Aberto',
    Closed = 'Fechado',
}

export enum LeadStage {
    New = 'Novo',
    Contacted = 'Contactado',
    Qualified = 'Qualificado',
    Proposal = 'Proposta',
    Negotiation = 'Negociação',
    Nurturing = 'Nutrição',
}

export enum LeadStatus {
    Open = 'Aberto',
    Won = 'Ganho',
    Lost = 'Perdido',
}

export enum LeadSource {
    Website = 'Website',
    Referral = 'Indicação',
    ColdCall = 'Cold Call',
    Event = 'Evento',
    Other = 'Outro',
}

export enum DocumentCategory {
    Contratos = 'Contratos',
    Fiscal = 'Fiscal',
    Pessoal = 'Pessoal',
    Contabil = 'Contábil',
    Outros = 'Outros',
}

export enum CommunicationType {
    Email = 'E-mail',
    Chamada = 'Chamada',
    Reunião = 'Reunião',
    Outro = 'Outro',
}

export enum ProcessFrequency {
    Daily = 'Diário',
    Weekly = 'Semanal',
    Monthly = 'Mensal',
    Yearly = 'Anual',
}

export enum AutomationTriggerType {
    LeadInactivity = 'LeadInactivity',
    NewLeadCreated = 'NewLeadCreated',
    ClientStatusChanged = 'ClientStatusChanged',
}

export enum AutomationActionType {
    MoveLeadStage = 'MoveLeadStage',
    CreateTask = 'CreateTask',
    SendEmail = 'SendEmail',
    SendAlert = 'SendAlert',
}

export enum UserRole {
    Admin = 'Administrador',
    Manager = 'Gerente',
    Analyst = 'Analista',
}

export enum HistoryEventType {
    Complaint = 'Reclamação',
    Praise = 'Elogio',
    RelevantFact = 'Fato Relevante',
    ContractChange = 'Alteração Contratual',
    General = 'Geral'
}

export enum OpinionType {
    PTI = 'PTI (Parecer Técnico Interno)',
    PTC = 'PTC (Parecer Técnico Cliente)'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
}

export interface FinancialDataPoint {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
}

export interface Document {
    id: string;
    clientId: string;
    name: string;
    uploadDate: Date;
    category: DocumentCategory;
    fileSize: string;
    isPublic: boolean;
}

export interface AccountManager {
    name: string;
    email: string;
    phone: string;
}

export interface CommunicationLog {
    id: string;
    clientId: string;
    date: Date;
    type: CommunicationType;
    subject: string;
    content: string;
}

export interface ClientHistoryEvent {
    id: string;
    clientId: string;
    date: Date;
    type: HistoryEventType;
    description: string;
    author: string;
}

export interface TechnicalOpinion {
    id: string;
    clientId: string;
    date: Date;
    type: OpinionType;
    title: string;
    content: string;
    author: string;
    tags?: string[];
}

export interface AppliedProcess {
    processModelId: string;
    lastApplied: Date;
}

export interface Client {
    id: string;
    name: string;
    companyName: string;
    cnpj: string;
    email: string;
    phone: string;
    joinedDate: Date;
    onboardingStatus: OnboardingStatus;
    stage: ClientStage;
    plan: ClientPlan;
    taxRegime: TaxRegime;
    accountManager: AccountManager;
    npsScore?: number;
    inWarning: boolean;
    isBlocked: boolean;
    warningMessage: string;
    documents: Document[];
    financials: FinancialDataPoint[];
    tags: string[];
    state: string;
    city: string;
    acquisitionChannel: AcquisitionChannel;
    dominioCode: string;
    category: string;
    fee: string;
    entry: string;
    group: string;
    segmento: string;
    accountingResponsible: string;
    appliedProcesses: AppliedProcess[];
    communicationLogs: CommunicationLog[];
    clientHistory: ClientHistoryEvent[];
    technicalOpinions: TechnicalOpinion[];
    closing?: string;
    useContaAzul?: 'Sim' | 'Não';
    banks?: string[];
}

export interface Task {
    id: string;
    title: string;
    clientId: string;
    dueDate: Date;
    status: TaskStatus;
    priority: TaskPriority;
    description?: string;
    responsibleNames?: string;
}

export interface Ticket {
    id: string;
    title: string;
    clientId: string;
    reportedDate: Date;
    status: TicketStatus;
}

export interface BVC {
    id: string;
    clientId: string;
    visitDate: Date;
    consultant: string;
    objective: string;
    summary: string;
}

export interface Lead {
    id: string;
    name: string;
    company: string;
    value: number;
    stage: LeadStage;
    status: LeadStatus;
    source: LeadSource;
    lastContacted: Date;
}

export interface Notification {
    id: string;
    clientId: string;
    date: Date;
    text: string;
    isRead: boolean;
    type: 'task' | 'document' | 'ticket' | 'general';
}

export interface NewClientData {
    name: string;
    responsibleName: string;
    responsibleId: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    acquisitionChannel: AcquisitionChannel;
    product: ClientPlan;
    plan: ClientPlan;
    companyName: string;
    cnpj: string;
    domainCode: string;
    category: string;
    fee: string;
    status: OnboardingStatus;
    entryDate: string;
    taxRegime: TaxRegime;
    group: string;
    entryProcess: EntryProcess;
    departmentResponsible: string;
    hasEmployee: 'Sim' | 'Não';
    proLabore: 'Sim' | 'Não';
    hasCertificate: 'Sim' | 'Não';
    fiscalDepartmentResponsible: string;
    rFactor: 'Sim' | 'Não';
    mainBranch: string;
    secondaryBranch: string;
    annex: string;
    secondaryAnnex: string;
    stateRegistration: string;
    municipalRegistration: string;
    accountingDepartmentResponsible: string;
    closing: string;
    useContaAzul: 'Sim' | 'Não';
    banks: string[];
    importedLogs?: Omit<CommunicationLog, 'id' | 'clientId'>[];
    importedDocs?: Omit<Document, 'id' | 'clientId'>[];
}

export type AutomationTrigger =
    | { type: AutomationTriggerType.LeadInactivity; days: number }
    | { type: AutomationTriggerType.NewLeadCreated }
    | { type: AutomationTriggerType.ClientStatusChanged; status: OnboardingStatus };

export type AutomationAction =
    | { type: AutomationActionType.MoveLeadStage; stage: LeadStage }
    | { type: AutomationActionType.CreateTask; title: string; daysUntilDue: number }
    | { type: AutomationActionType.SendEmail; subject: string; body: string }
    | { type: AutomationActionType.SendAlert; message: string; channels: string[] };

export interface Automation {
    id: string;
    name: string;
    enabled: boolean;
    trigger: AutomationTrigger;
    action: AutomationAction;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export type CalendarItem = (Task & { type: 'task' }) | (CalendarEvent & { type: 'event' });

export interface TaskTemplate {
    id: string;
    title: string;
    dueDayOffset: number; 
}

export interface ProcessModel {
    id: string;
    name: string;
    description?: string;
    frequency: ProcessFrequency;
    tasks: TaskTemplate[];
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
}

export interface AiMessage {
    sender: 'ai' | 'user';
    text: string;
    isAction?: boolean;
}

// Interfaces para Formulários
export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number';
    required: boolean;
    options?: string[]; // Para campos tipo select
}

export interface FormModel {
    id: string;
    name: string;
    description: string;
    fields: FormField[];
}

// PipeRun Interfaces
export interface PipeRunDeal {
    id: number;
    title: string;
    value: number;
    status: string;
    stage_id: number;
    pipeline_id: number;
    company?: {
        id: number;
        name: string;
        cnpj?: string;
    };
    person?: {
        name: string;
        email?: string;
        mobile_phone?: string;
    };
    city?: string;
    state?: string;
    created_at: string;
}

export interface PipeRunActivity {
    id: number;
    title: string;
    description: string;
    type: string; 
    created_at: string;
}

export interface PipeRunFile {
    id: number;
    name: string;
    url: string;
    created_at: string;
    size?: string;
}

export interface PipeRunResponse {
    success: boolean;
    data: PipeRunDeal[];
    meta: {
        total: number;
        count: number;
        page: number;
    }
}

// e-Kontroll Interfaces
export interface EKontrollClient {
    id: number;
    razao_social: string;
    nome_fantasia: string;
    cnpj_cpf: string;
    email_contato: string;
    telefone_contato: string;
    endereco_cidade: string;
    endereco_uf: string;
    valor_mensalidade: number;
    data_cadastro: string;
    status: string;
}

export interface EKontrollResponse {
    data: EKontrollClient[];
}
