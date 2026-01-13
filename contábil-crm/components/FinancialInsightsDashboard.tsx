import React, { useState, useEffect } from 'react';
import { FinancialDataPoint } from '../types';
import { generateText } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700/50 rounded w-full"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700/50 rounded w-5/6"></div>
    </div>
);

const AiFinancialSummary: React.FC<{ financialData: FinancialDataPoint[], clientName: string }> = ({ financialData, clientName }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateSummary = async () => {
            if (!financialData || financialData.length < 2) {
                setSummary("Dados insuficientes para uma análise detalhada.");
                setIsLoading(false);
                return;
            };
            
            setIsLoading(true);
            const dataSummary = financialData.map(d => `- ${d.month}: Receita R$${d.revenue}, Despesa R$${d.expenses}, Lucro R$${d.profit}`).join('\n');
            const prompt = `
                Dados Financeiros da empresa "${clientName}":
                ${dataSummary}

                Com base nesses dados, gere um resumo conciso e amigável para o dono da empresa.
                Destaque a principal tendência (crescimento, estabilidade, queda), identifique o mês de melhor performance e ofereça um insight ou ponto de atenção.
                Use markdown simples (negrito para ênfase).
            `;
            const systemInstruction = "Você é um consultor financeiro. Sua tarefa é traduzir dados brutos em insights claros e acionáveis para empresários.";
            
            const result = await generateText(prompt, systemInstruction);
            setSummary(result);
            setIsLoading(false);
        };
        generateSummary();
    }, [financialData, clientName]);

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 01.326 1.648l-3.32 3.018 1.18 4.344a1 1 0 01-1.449 1.084L12 16.34l-3.233 2.89a1 1 0 01-1.45-1.084l1.18-4.344L5.174 10.78a1 1 0 01.326-1.648L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                Análise da IA
            </h4>
             {isLoading ? <LoadingSkeleton /> : (
                <div className="text-zinc-600 dark:text-zinc-300 text-sm whitespace-pre-wrap space-y-2" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black dark:text-white">$1</strong>').replace(/(\r\n|\n|\r)/gm, "<br />") }} />
            )}
        </div>
    );
};

const FinancialStatCard: React.FC<{ title: string; value: string; change: string; isPositive: boolean; }> = ({ title, value, change, isPositive }) => (
    <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
        <p className="text-black dark:text-white text-3xl font-bold mt-1">{value}</p>
        <div className="flex items-center text-sm mt-1">
            <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                }
                {change}
            </span>
            <span className="text-zinc-500 dark:text-zinc-500 ml-1">vs mês anterior</span>
        </div>
    </div>
);

export const FinancialInsightsDashboard: React.FC<{ financialData: FinancialDataPoint[], clientName: string }> = ({ financialData, clientName }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!financialData || financialData.length === 0) {
        return (
            <div className="text-center text-zinc-500 dark:text-zinc-400 py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h3 className="mt-2 text-lg font-medium text-black dark:text-white">Sem Dados Financeiros</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Não há dados financeiros para exibir para este cliente ainda.</p>
            </div>
        );
    }
    
    const latestData = financialData[financialData.length - 1];
    const previousData = financialData.length > 1 ? financialData[financialData.length - 2] : null;

    const calculateChange = (current: number, previous: number | null | undefined) => {
        if (previous === null || previous === undefined || previous === 0) return { percent: 'N/A', isPositive: true };
        const change = ((current - previous) / previous) * 100;
        return {
            percent: `${Math.abs(change).toFixed(1)}%`,
            isPositive: change >= 0
        };
    };

    const revenueChange = calculateChange(latestData.revenue, previousData?.revenue);
    const expensesChange = calculateChange(latestData.expenses, previousData?.expenses);
    const profitMargin = latestData.revenue > 0 ? (latestData.profit / latestData.revenue) * 100 : 0;
    const prevProfitMargin = (previousData && previousData.revenue > 0) ? (previousData.profit / previousData.revenue) * 100 : null;
    const profitMarginChange = calculateChange(profitMargin, prevProfitMargin);

    return (
        <div className="space-y-6 animate-fadeInUp" style={{ animationDuration: '0.4s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancialStatCard 
                    title="Faturamento" 
                    value={latestData.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                    change={revenueChange.percent}
                    isPositive={revenueChange.isPositive}
                />
                 <FinancialStatCard 
                    title="Despesas" 
                    value={latestData.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                    change={expensesChange.percent}
                    isPositive={!expensesChange.isPositive} // Less expense is positive
                />
                 <FinancialStatCard 
                    title="Margem de Lucro" 
                    value={`${profitMargin.toFixed(1)}%`}
                    change={profitMarginChange.percent}
                    isPositive={profitMarginChange.isPositive}
                />
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 p-6 rounded-xl h-96 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                     <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Performance Financeira</h4>
                     <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={financialData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.7}/>
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3f3f46" : "#e2e8f0"} />
                            <XAxis dataKey="month" stroke={isDark ? "#a1a1aa" : "#52525b"} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={isDark ? "#a1a1aa" : "#52525b"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                    borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                                    color: isDark ? '#f4f4f5' : '#18181b',
                                    borderRadius: '0.5rem',
                                    backdropFilter: 'blur(4px)',
                                }}
                                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            />
                            <Legend 
                                wrapperStyle={{fontSize: "14px"}} 
                                formatter={(value) => <span className="text-zinc-600 dark:text-zinc-400">{value}</span>}
                            />
                            <Area type="monotone" dataKey="revenue" name="Receita" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="expenses" name="Despesas" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                        </AreaChart>
                     </ResponsiveContainer>
                 </div>
                 <AiFinancialSummary financialData={financialData} clientName={clientName} />
             </div>
        </div>
    );
};