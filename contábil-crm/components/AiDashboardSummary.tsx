import React, { useState, useEffect } from 'react';
import { Client, Task, Ticket, TaskStatus, TicketStatus, OnboardingStatus } from '../types';
import { generateText } from '../services/geminiService';

interface AiDashboardSummaryProps {
  clients: Client[];
  tasks: Task[];
  tickets: Ticket[];
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700/50 rounded w-full"></div>
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700/50 rounded w-5/6"></div>
    </div>
);

export const AiDashboardSummary: React.FC<AiDashboardSummaryProps> = ({ clients, tasks, tickets }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateSummary = async () => {
            setIsLoading(true);
            const openTickets = tickets.filter(t => t.status === TicketStatus.Open).length;
            const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Done).length;
            const clientsInOnboarding = clients.filter(c => c.onboardingStatus === OnboardingStatus.Onboarding).length;

            const prompt = `
                Dados do CRM de Contabilidade:
                - Clientes totais: ${clients.length}
                - Clientes em onboarding: ${clientsInOnboarding}
                - Tarefas atrasadas: ${overdueTasks}
                - Tickets de suporte abertos: ${openTickets}

                Com base nesses dados, gere um resumo curto e acionável para o gerente do escritório.
                Destaque os pontos críticos que exigem atenção imediata.
                Use markdown simples para formatar a resposta (negrito para ênfase e listas de itens).
            `;
            const systemInstruction = "Você é um analista de dados sênior especialista em CRMs para escritórios de contabilidade. Sua tarefa é fornecer insights rápidos e claros.";
            
            const result = await generateText(prompt, systemInstruction);
            setSummary(result);
            setIsLoading(false);
        };
        generateSummary();
    }, [clients, tasks, tickets]);

    return (
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg shadow-lg flex items-start gap-4 border border-zinc-200 dark:border-zinc-800">
            <div className="bg-primary/10 dark:bg-gold/10 text-primary dark:text-gold p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 01.326 1.648l-3.32 3.018 1.18 4.344a1 1 0 01-1.449 1.084L12 16.34l-3.233 2.89a1 1 0 01-1.45-1.084l1.18-4.344L5.174 10.78a1 1 0 01.326-1.648L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Resumo Diário da IA</h3>
                {isLoading ? <LoadingSkeleton /> : (
                     <div className="text-zinc-600 dark:text-zinc-300 text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black dark:text-white">$1</strong>').replace(/\* (.*?)(?=\n|$)/g, '<li>$1</li>').replace(/(\r\n|\n|\r)/gm, "<br>").replace(/<li>/g, '<li class="list-disc list-inside">')  }} />

                )}
            </div>
        </div>
    );
};