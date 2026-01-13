
import React, { useState } from 'react';
import { Automation, LeadStage, OnboardingStatus, AutomationTriggerType, AutomationActionType, AutomationTrigger, AutomationAction } from '../types';

interface AutomationViewProps {
    automations: Automation[];
    addAutomation: (automation: Omit<Automation, 'id'>) => void;
    toggleAutomation: (automationId: string) => void;
    applyAutomations: () => number;
}

const AddAutomationModal: React.FC<{
    onClose: () => void;
    addAutomation: (automation: Omit<Automation, 'id'>) => void;
}> = ({ onClose, addAutomation }) => {
    // Form state
    const [name, setName] = useState('');
    const [triggerType, setTriggerType] = useState<AutomationTriggerType>(AutomationTriggerType.LeadInactivity);
    const [actionType, setActionType] = useState<AutomationActionType>(AutomationActionType.MoveLeadStage);

    // Trigger-specific state
    const [inactivityDays, setInactivityDays] = useState(7);
    const [clientStatus, setClientStatus] = useState<OnboardingStatus>(OnboardingStatus.Active);
    
    // Action-specific state
    const [leadStage, setLeadStage] = useState<LeadStage>(LeadStage.Nurturing);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDaysUntilDue, setTaskDaysUntilDue] = useState(2);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    
    // Alert-specific state
    const [alertMessage, setAlertMessage] = useState('');
    const [alertChannels, setAlertChannels] = useState<string[]>(['system']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let trigger: AutomationTrigger;
        switch (triggerType) {
            case AutomationTriggerType.NewLeadCreated:
                trigger = { type: AutomationTriggerType.NewLeadCreated };
                break;
            case AutomationTriggerType.ClientStatusChanged:
                trigger = { type: AutomationTriggerType.ClientStatusChanged, status: clientStatus };
                break;
            case AutomationTriggerType.LeadInactivity:
            default:
                trigger = { type: AutomationTriggerType.LeadInactivity, days: inactivityDays };
                break;
        }

        let action: AutomationAction;
        switch (actionType) {
            case AutomationActionType.CreateTask:
                action = { type: AutomationActionType.CreateTask, title: taskTitle, daysUntilDue: taskDaysUntilDue };
                break;
            case AutomationActionType.SendEmail:
                action = { type: AutomationActionType.SendEmail, subject: emailSubject, body: emailBody };
                break;
            case AutomationActionType.SendAlert:
                action = { type: AutomationActionType.SendAlert, message: alertMessage, channels: alertChannels };
                break;
            case AutomationActionType.MoveLeadStage:
            default:
                action = { type: AutomationActionType.MoveLeadStage, stage: leadStage };
                break;
        }

        addAutomation({
            name,
            enabled: true,
            trigger,
            action,
        });
        onClose();
    };
    
    const handleChannelChange = (channel: string) => {
        setAlertChannels(prev =>
            prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
        );
    };
    
    const renderTriggerOptions = () => {
        switch (triggerType) {
            case AutomationTriggerType.LeadInactivity:
                return (
                    <div className="flex items-center gap-4 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                       <span className="text-zinc-600 dark:text-zinc-300">Um lead não for contatado por</span>
                       <input type="number" value={inactivityDays} onChange={e => setInactivityDays(parseInt(e.target.value, 10))} className="w-20 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-1 px-2 text-black dark:text-white text-center" />
                       <span className="text-zinc-600 dark:text-zinc-300">dias</span>
                    </div>
                );
            case AutomationTriggerType.ClientStatusChanged:
                return (
                     <div className="flex items-center gap-4 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                       <span className="text-zinc-600 dark:text-zinc-300">O status de um cliente mudar para</span>
                       <select value={clientStatus} onChange={e => setClientStatus(e.target.value as OnboardingStatus)} className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm py-1 px-2 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                           {Object.values(OnboardingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                );
             case AutomationTriggerType.NewLeadCreated:
                return <p className="text-zinc-600 dark:text-zinc-300 animate-fadeInUp" style={{animationDuration: '0.3s'}}>Um novo lead for criado no sistema.</p>
            default:
                return null;
        }
    }
    
    const renderActionOptions = () => {
         switch (actionType) {
            case AutomationActionType.MoveLeadStage:
                return (
                     <div className="flex items-center gap-4 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                       <span className="text-zinc-600 dark:text-zinc-300">Mover o lead para a etapa</span>
                       <select value={leadStage} onChange={e => setLeadStage(e.target.value as LeadStage)} className="bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm py-1 px-2 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                           {Object.values(LeadStage).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                );
            case AutomationActionType.CreateTask:
                return (
                    <div className="space-y-3 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                        <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Título da tarefa" className="block w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-2 px-3 text-black dark:text-white" required />
                        <div className="flex items-center gap-2">
                           <span className="text-zinc-600 dark:text-zinc-300">com vencimento em</span>
                           <input type="number" value={taskDaysUntilDue} onChange={e => setTaskDaysUntilDue(parseInt(e.target.value, 10))} className="w-20 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-1 px-2 text-black dark:text-white text-center" />
                           <span className="text-zinc-600 dark:text-zinc-300">dias.</span>
                        </div>
                    </div>
                );
            case AutomationActionType.SendEmail:
                return (
                    <div className="space-y-3 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                        <p className="text-xs text-amber-500 dark:text-amber-400">Funcionalidade simulada. Nenhum email será enviado.</p>
                        <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Assunto do email" className="block w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-2 px-3 text-black dark:text-white" required />
                        <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={3} placeholder="Corpo do email" className="block w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-2 px-3 text-black dark:text-white" required />
                    </div>
                );
            case AutomationActionType.SendAlert:
                return (
                    <div className="space-y-4 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                        <input type="text" value={alertMessage} onChange={e => setAlertMessage(e.target.value)} placeholder="Mensagem do alerta (ex: Novo cliente high-ticket!)" className="block w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md py-2 px-3 text-black dark:text-white" required />
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Canais de Envio:</label>
                            <div className="flex gap-4">
                                {['email', 'mobile', 'system'].map(channel => (
                                    <label key={channel} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={alertChannels.includes(channel)}
                                            onChange={() => handleChannelChange(channel)}
                                            className="rounded text-gold focus:ring-gold bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600"
                                        />
                                        <span className="capitalize text-sm text-black dark:text-white">
                                            {channel === 'mobile' ? 'Celular' : channel === 'system' ? 'Sistema' : 'E-mail'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeInUp" style={{animationDuration: '0.2s'}}>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Criar Nova Automação</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome da Automação</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" placeholder="Ex: Onboarding de novos clientes" required />
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <p className="text-sm font-semibold text-sky-500 dark:text-sky-400">SE (Gatilho)</p>
                        <select value={triggerType} onChange={e => setTriggerType(e.target.value as AutomationTriggerType)} className="w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                            <option value={AutomationTriggerType.LeadInactivity}>Um lead ficar inativo</option>
                            <option value={AutomationTriggerType.NewLeadCreated}>Um novo lead for criado</option>
                            <option value={AutomationTriggerType.ClientStatusChanged}>O status de um cliente mudar</option>
                        </select>
                        {renderTriggerOptions()}
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <p className="text-sm font-semibold text-emerald-500 dark:text-emerald-400">ENTÃO (Ação)</p>
                         <select value={actionType} onChange={e => setActionType(e.target.value as AutomationActionType)} className="w-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                           <option value={AutomationActionType.MoveLeadStage}>Mover lead para etapa</option>
                           <option value={AutomationActionType.CreateTask}>Criar uma tarefa</option>
                           <option value={AutomationActionType.SendEmail}>Enviar um email (simulação)</option>
                           <option value={AutomationActionType.SendAlert}>Gerar Alerta Interno</option>
                         </select>
                         {renderActionOptions()}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">Salvar Automação</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AutomationView: React.FC<AutomationViewProps> = ({ automations, addAutomation, toggleAutomation, applyAutomations }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [runMessage, setRunMessage] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRunAutomations = () => {
        setIsRunning(true);
        setRunMessage('');
        setTimeout(() => {
            const changes = applyAutomations();
            setRunMessage(`${changes} lead(s) foram atualizados pela regra de inatividade.`);
            setIsRunning(false);
            setTimeout(() => setRunMessage(''), 4000);
        }, 500);
    };

    const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; }> = ({ enabled, onChange }) => (
        <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-gold' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    const renderTriggerDescription = (trigger: AutomationTrigger) => {
        switch (trigger.type) {
            case AutomationTriggerType.LeadInactivity:
                return `um lead ficar inativo por ${trigger.days} dias`;
            case AutomationTriggerType.NewLeadCreated:
                return `um novo lead for criado`;
            case AutomationTriggerType.ClientStatusChanged:
                return `o status do cliente mudar para "${trigger.status}"`;
            default:
                return 'Gatilho desconhecido';
        }
    };

    const renderActionDescription = (action: AutomationAction) => {
        switch (action.type) {
            case AutomationActionType.MoveLeadStage:
                return `mover para a etapa "${action.stage}"`;
            case AutomationActionType.CreateTask:
                return `criar a tarefa "${action.title}"`;
            case AutomationActionType.SendEmail:
                return `enviar o email "${action.subject}"`;
            case AutomationActionType.SendAlert:
                const channels = action.channels.map(c => c === 'mobile' ? 'Celular' : c === 'system' ? 'Sistema' : 'Email').join(', ');
                return `alertar via ${channels} com a mensagem "${action.message}"`;
            default:
                return 'Ação desconhecida';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <h1 className="text-3xl font-bold text-black dark:text-white">Automações de Vendas</h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleRunAutomations} disabled={isRunning} className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white px-4 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait" title="Executa apenas as regras de inatividade de lead.">
                        {isRunning ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                        )}
                        {isRunning ? 'Executando...' : 'Executar Inatividade'}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Criar Automação
                    </button>
                </div>
            </div>
            {runMessage && <div className="bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 text-sm font-medium px-4 py-2 rounded-lg text-center">{runMessage}</div>}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Regras Ativas</h3>
                {automations.length > 0 ? (
                    <div className="space-y-4">
                        {automations.map(auto => (
                            <div key={auto.id} className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-black dark:text-white">{auto.name}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        <span className="font-semibold text-sky-500 dark:text-sky-400">SE</span> {renderTriggerDescription(auto.trigger)},{' '}
                                        <span className="font-semibold text-emerald-500 dark:text-emerald-400">ENTÃO</span> {renderActionDescription(auto.action)}.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-medium ${auto.enabled ? 'text-green-500 dark:text-green-400' : 'text-zinc-500 dark:text-zinc-500'}`}>{auto.enabled ? 'Ativa' : 'Inativa'}</span>
                                    <ToggleSwitch enabled={auto.enabled} onChange={() => toggleAutomation(auto.id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <h3 className="mt-2 text-lg font-medium text-black dark:text-white">Nenhuma automação criada</h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Automatize tarefas repetitivas e foque no que importa.</p>
                    </div>
                )}
            </div>
            {isModalOpen && <AddAutomationModal onClose={() => setIsModalOpen(false)} addAutomation={addAutomation} />}
        </div>
    );
};
