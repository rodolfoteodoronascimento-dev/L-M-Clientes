
import React from 'react';
import { Client, OnboardingStatus } from '../types';
import { ClientPlanChart } from './ClientPlanChart';
import { ClientTaxRegimeChart } from './ClientTaxRegimeChart';
import { ClientStageChart } from './ClientStageChart'; // New
import { AcquisitionChannelChart } from './AcquisitionChannelChart'; // New

interface ClientsViewProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onStartAddClient: () => void;
}

const KpiCard: React.FC<{ title: string; value: string; subtitle?: string; icon: React.ReactNode; }> = ({ title, value, subtitle, icon }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-primary">{icon}</div>
        <div>
            <p className="text-zinc-500 dark:text-zinc-400 font-semibold">{title}</p>
            <p className="text-4xl font-bold text-black dark:text-white mt-1">{value}</p>
            {subtitle && <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onSelectClient, onStartAddClient }) => {
    const activeClients = clients.filter(c => c.onboardingStatus === OnboardingStatus.Active);
    
    const newClientsThisMonth = clients.filter(c => {
        const joinDate = new Date(c.joinedDate);
        const today = new Date();
        return joinDate.getMonth() === today.getMonth() && joinDate.getFullYear() === today.getFullYear();
    }).length;

    const churnedClients = clients.filter(c => c.onboardingStatus === OnboardingStatus.Churned).length;
    
    const calculateLTV = () => {
        const activeClientsWithFee = activeClients.filter(c => c.fee && !isNaN(parseFloat(c.fee)));
        if (activeClientsWithFee.length === 0) return 'R$ 0,00';
        const averageFee = activeClientsWithFee.reduce((sum, c) => sum + parseFloat(c.fee), 0) / activeClientsWithFee.length;
        const ltv = averageFee * 24; // Mock LTV: 24 months (2 years)
        return ltv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const atRiskClients = clients.filter(c => c.inWarning).slice(0, 5);
    const recentClients = [...clients].sort((a,b) => b.joinedDate.getTime() - a.joinedDate.getTime()).slice(0, 5);

    return (
        <div className="space-y-8 animate-fadeInUp">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-black dark:text-white">Dashboard de Clientes</h2>
                <button 
                    onClick={onStartAddClient}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-lg hover:from-primary-light hover:to-primary transition-all transform active:scale-95"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Cadastrar Cliente
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Clientes Ativos" 
                    value={activeClients.length.toString()} 
                    subtitle={`de ${clients.length} no total`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
                />
                 <KpiCard 
                    title="Novos Clientes (Mês)" 
                    value={newClientsThisMonth.toString()} 
                    subtitle="Clientes que entraram este mês"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
                />
                 <KpiCard 
                    title="Clientes em Churn" 
                    value={churnedClients.toString()}
                    subtitle="Total de clientes perdidos"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 01-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                 <KpiCard 
                    title="LTV Estimado" 
                    value={calculateLTV()}
                    subtitle="Valor médio por cliente (24m)"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 backdrop-blur-sm"><ClientStageChart clients={clients} /></div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 backdrop-blur-sm"><ClientPlanChart clients={clients} /></div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 backdrop-blur-sm"><ClientTaxRegimeChart clients={clients} /></div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 backdrop-blur-sm"><AcquisitionChannelChart clients={clients} /></div>
            </div>

             {/* Lists */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Clientes em Risco</h3>
                    <div className="space-y-3">
                        {atRiskClients.length > 0 ? atRiskClients.map(client => (
                            <div key={client.id} onClick={() => onSelectClient(client.id)} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center cursor-pointer transition-all hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 transform hover:-translate-y-0.5">
                                <div>
                                    <p className="font-medium text-black dark:text-white">{client.companyName}</p>
                                    <p className="text-sm text-yellow-500 dark:text-yellow-500">{client.warningMessage}</p>
                                </div>
                                <span className="text-sm text-yellow-500 dark:text-yellow-500 font-bold">Ver</span>
                            </div>
                        )) : <p className="text-zinc-500 dark:text-zinc-500 text-center py-4">Nenhum cliente em risco no momento.</p>}
                    </div>
                </div>
                 <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Clientes Recentes</h3>
                     <div className="space-y-3">
                        {recentClients.map(client => (
                             <div key={client.id} onClick={() => onSelectClient(client.id)} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center cursor-pointer transition-all hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 transform hover:-translate-y-0.5">
                                <div>
                                    <p className="font-medium text-black dark:text-white">{client.companyName}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Entrou em {client.joinedDate.toLocaleDateString('pt-BR')}</p>
                                </div>
                                 <span className="text-sm text-green-500 dark:text-green-500 font-bold">Ver</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </div>
    );
};
