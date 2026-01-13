
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { AiMessage, Client, Lead, LeadStage, OnboardingStatus, Task, BVC, TaskPriority } from '../types';

interface AiAssistantProps {
    clients: Client[];
    leads: Lead[];
    tasks: Task[];
    bvcs: BVC[];
    getClientByName: (name: string) => Client | undefined;
    getLeadByName: (name: string) => Lead | undefined;
    addTask: (task: Omit<Task, 'id' | 'status'>) => void;
    updateLeadStage: (leadId: string, stage: LeadStage) => void;
}

const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'createTask',
        description: 'Cria uma nova tarefa para um cliente específico.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                clientName: { type: Type.STRING, description: 'O nome da empresa do cliente.' },
                title: { type: Type.STRING, description: 'O título ou descrição curta da tarefa.' },
                dueDate: { type: Type.STRING, description: 'A data de vencimento (AAAA-MM-DD).' },
            },
            required: ['clientName', 'title', 'dueDate'],
        },
    },
    {
        name: 'getAtRiskClients',
        description: 'Retorna a lista de clientes que possuem alertas de risco ou NPS baixo.',
        parameters: { type: Type.OBJECT, properties: {} },
    }
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ 
    clients, leads, tasks, addTask, updateLeadStage, getClientByName, getLeadByName 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<AiMessage[]>([
        { sender: 'ai', text: 'Olá! Sou seu consultor estratégico. Posso analisar sua carteira, criar tarefas ou resumir seu funil. Como posso ajudar?' }
    ]);
    
    const chatRef = useRef<Chat | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return;

        const ai = new GoogleGenAI({ apiKey });
        const summary = `
            CONTEXTO CRM:
            - Clientes Ativos: ${clients.length}
            - Leads no Funil: ${leads.length}
            - Valor Total Pipeline: R$ ${leads.reduce((acc, l) => acc + l.value, 0).toLocaleString('pt-BR')}
            - Tarefas Pendentes: ${tasks.filter(t => t.status !== 'Tarefa Feita').length}
        `;

        chatRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `Você é um assistente de IA integrado ao Contábil CRM. 
                ${summary}
                Regras:
                1. Responda sempre em Português (Brasil).
                2. Seja conciso e profissional.
                3. Use ferramentas quando o usuário pedir para agendar algo ou ver riscos.`,
                tools: [{ functionDeclarations }],
            },
        });
    }, [clients, leads, tasks]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setIsLoading(true);

        try {
            let result = await chatRef.current.sendMessage({ message: userText });
            
            // Handle Function Calls
            if (result.functionCalls) {
                for (const fc of result.functionCalls) {
                    let functionResult: any = { success: false };
                    
                    if (fc.name === 'createTask') {
                        const client = getClientByName(fc.args.clientName as string);
                        if (client) {
                            addTask({ 
                                clientId: client.id, 
                                title: fc.args.title as string, 
                                dueDate: new Date(fc.args.dueDate as string),
                                priority: TaskPriority.Medium 
                            });
                            functionResult = { success: true, message: "Tarefa criada com sucesso." };
                        } else {
                            functionResult = { success: false, message: "Cliente não encontrado." };
                        }
                    } else if (fc.name === 'getAtRiskClients') {
                        const atRisk = clients.filter(c => c.inWarning || (c.npsScore && c.npsScore < 7));
                        functionResult = { clients: atRisk.map(c => c.companyName) };
                    }

                    result = await chatRef.current.sendMessage({
                        message: [{
                            functionResponse: {
                                id: fc.id,
                                name: fc.name,
                                response: functionResult
                            }
                        }] as any
                    });
                }
            }

            setMessages(prev => [...prev, { sender: 'ai', text: result.text || "Entendido." }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Erro na conexão com o cérebro da IA. Tente novamente." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-96 h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
                    <div className="p-4 bg-zinc-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-black text-xs uppercase tracking-widest">Gemini Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-primary text-zinc-900 font-bold' : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Pergunte algo..."
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary dark:text-white"
                            />
                            <button type="submit" disabled={isLoading} className="p-2 bg-primary text-zinc-900 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-zinc-900 dark:bg-primary text-primary dark:text-zinc-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,204,41,0.4)] hover:scale-110 transition-transform active:scale-95 border-2 border-primary/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </button>
        </div>
    );
};
