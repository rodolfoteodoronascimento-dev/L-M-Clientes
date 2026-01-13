
import React, { useState, useRef } from 'react';
import { Lead, LeadSource, LeadStatus, LeadStage, Task, TaskStatus, CalendarEvent } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../contexts/ThemeContext';

interface SalesDashboardViewProps {
    leads: Lead[];
    tasks: Task[];
    calendarEvents: CalendarEvent[];
}

const StatCard: React.FC<{ title: string; value: string; subValue: string; icon: React.ReactNode; trendUp?: boolean; }> = ({ title, value, subValue, icon, trendUp }) => (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-start">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
            {icon}
        </div>
        <p className="text-black dark:text-white text-3xl font-bold mt-2">{value}</p>
        <p className={`text-sm mt-1 flex items-center ${trendUp ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-500'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {trendUp ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />}
             </svg>
            {subValue}
        </p>
    </div>
);

const SmallStatCard: React.FC<{ title: string; value: string; subValue: string; }> = ({ title, value, subValue }) => (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 h-full flex flex-col justify-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
        <p className="text-black dark:text-white text-4xl font-bold mt-2">{value}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subValue}</p>
    </div>
);

const ProjectionsTab: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    // Data processing
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => [LeadStage.Qualified, LeadStage.Proposal, LeadStage.Negotiation].includes(l.stage) || l.status !== LeadStatus.Open).length;
    const proposalLeads = leads.filter(l => [LeadStage.Proposal, LeadStage.Negotiation].includes(l.stage) || l.status === LeadStatus.Won).length;
    const wonLeads = leads.filter(l => l.status === LeadStatus.Won).length;
    const lostLeads = leads.filter(l => l.status === LeadStatus.Lost).length;

    const winRate = wonLeads + lostLeads > 0 ? ((wonLeads / (wonLeads + lostLeads)) * 100).toFixed(1) : '0.0';

    const convLeadToQual = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0.0';
    const convQualToProp = qualifiedLeads > 0 ? ((proposalLeads / qualifiedLeads) * 100).toFixed(1) : '0.0';
    const convPropToWon = proposalLeads > 0 ? ((wonLeads / proposalLeads) * 100).toFixed(1) : '0.0';

    // Mocked goal data
    const monthlyGoal = 60000;
    const currentSales = 48231;
    const goalAttainment = (currentSales / monthlyGoal) * 100;
    const radialData = [{ name: 'Meta', value: goalAttainment, fill: '#ffcc29' }];

    const FunnelStep: React.FC<{ title: string; value: number; conversion?: string; isFirst?: boolean }> = ({ title, value, conversion, isFirst = false }) => (
        <div className="flex-1 text-center bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{title}</h4>
            <p className="text-3xl font-bold text-black dark:text-white mt-1">{value}</p>
            {!isFirst && <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">{conversion}% de conversão</p>}
        </div>
    );
    
    const FunnelArrow = () => (
        <div className="flex-shrink-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </div>
    );

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl shadow-lg animate-fadeInUp space-y-8" style={{animationDuration: '0.3s'}}>
            <h3 className="font-semibold text-black dark:text-white text-xl">Análise de Metas e Performance</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                    <h4 className="font-semibold text-black dark:text-white mb-2">Meta de Vendas Mensal</h4>
                    <div className="w-48 h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                innerRadius="70%" 
                                outerRadius="100%" 
                                data={radialData} 
                                startAngle={90} 
                                endAngle={-270}
                                barSize={20}
                            >
                                <RadialBar
                                    background={{ fill: '#e4e4e7' }}
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-black dark:text-white">{goalAttainment.toFixed(0)}%</span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">atingido</span>
                        </div>
                    </div>
                    <p className="text-black dark:text-white mt-3 text-lg">{currentSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">de {monthlyGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                
                <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    <SmallStatCard title="Taxa de Vitória (Win Rate)" value={`${winRate}%`} subValue="Total de negócios" />
                    <SmallStatCard title="Ciclo de Venda Médio" value="18 dias" subValue="Do contato ao fechamento" />
                    <SmallStatCard title="Novos Leads (Mês)" value="12" subValue="Meta: 20" />
                    <SmallStatCard title="Negócios Fechados (Mês)" value={wonLeads.toString()} subValue="Meta: 35" />
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-black dark:text-white text-xl mb-4">Funil de Conversão</h3>
                <div className="flex items-stretch gap-2">
                    <FunnelStep title="Total de Leads" value={totalLeads} isFirst />
                    <FunnelArrow />
                    <FunnelStep title="Leads Qualificados" value={qualifiedLeads} conversion={convLeadToQual} />
                    <FunnelArrow />
                    <FunnelStep title="Propostas Enviadas" value={proposalLeads} conversion={convQualToProp} />
                    <FunnelArrow />
                    <FunnelStep title="Negócios Ganhos" value={wonLeads} conversion={convPropToWon} />
                </div>
            </div>
        </div>
    );
};

const TasksTab: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const relevantTasks = tasks.filter(t => t.status !== TaskStatus.Done)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg animate-fadeInUp border border-zinc-200 dark:border-zinc-800" style={{animationDuration: '0.3s'}}>
             <h3 className="font-semibold text-black dark:text-white text-xl mb-4">Tarefas de Vendas Pendentes</h3>
             <div className="space-y-3">
                {relevantTasks.length > 0 ? relevantTasks.map(task => (
                    <div key={task.id} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md flex justify-between items-center">
                        <div>
                            <p className="font-medium text-black dark:text-white">{task.title}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === TaskStatus.InProgress ? 'bg-amber-200 text-amber-800' : 'bg-zinc-200 text-zinc-800'}`}>{task.status}</span>
                    </div>
                )) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhuma tarefa pendente.</p>}
             </div>
        </div>
    );
};

const AgendaTab: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
    const upcomingEvents = events
        .filter(e => new Date(e.start) >= new Date())
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        .slice(0, 7); 

    const colorMap: Record<string, string> = {
        blue: 'border-sky-500',
        green: 'border-emerald-500',
        red: 'border-red-500',
        yellow: 'border-amber-500',
        purple: 'border-purple-500',
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg animate-fadeInUp border border-zinc-200 dark:border-zinc-800" style={{animationDuration: '0.3s'}}>
            <h3 className="font-semibold text-black dark:text-white text-xl mb-4">Próximos Compromissos</h3>
            <div className="space-y-4">
                {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-4">
                        <div className="text-center w-16 flex-shrink-0">
                            <p className="font-bold text-black dark:text-white text-lg">{new Date(event.start).toLocaleDateString('pt-BR', { day: 'numeric' })}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{new Date(event.start).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                        </div>
                        <div className={`border-l-4 pl-4 py-1 ${colorMap[event.color] || 'border-zinc-500'} w-full`}>
                            <p className="font-semibold text-black dark:text-white">{event.title}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                {new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(event.end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {event.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{event.description}</p>}
                        </div>
                    </div>
                )) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">Nenhum compromisso agendado.</p>}
            </div>
        </div>
    );
};


export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({ leads, tasks, calendarEvents }) => {
    const [activeTab, setActiveTab] = useState('Início');
    const [isDownloading, setIsDownloading] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleDownloadPdf = () => {
        if (!dashboardRef.current) return;
        setIsDownloading(true);

        html2canvas(dashboardRef.current, {
            backgroundColor: isDark ? '#18181b' : '#f4f4f5', // zinc-900 or zinc-100
            scale: 2
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('dashboard-vendas.pdf');
            setIsDownloading(false);
        }).catch(err => {
            console.error("Erro ao gerar PDF:", err);
            setIsDownloading(false);
        });
    };

    // Mock data processing
    const closedDeals = leads.filter(l => l.status === LeadStatus.Won).length;
    const totalPipelineValue = leads.reduce((acc, lead) => acc + lead.value, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const averageTicket = (leads.reduce((acc, lead) => acc + lead.value, 0) / leads.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // --- Black & Gold Theme Configuration ---
    const COLORS_PIPELINE = {
        Won: '#ffcc29', // Gold
        Open: isDark ? '#f4f4f5' : '#18181b', // White/Black
        Lost: isDark ? '#52525b' : '#a1a1aa', // Dark Grey/Light Grey
    };

    const pipelineData = [
        { name: 'Ganho', value: leads.filter(l => l.status === LeadStatus.Won).length, fill: COLORS_PIPELINE.Won },
        { name: 'Aberto', value: leads.filter(l => l.status === LeadStatus.Open).length, fill: COLORS_PIPELINE.Open },
        { name: 'Perdido', value: leads.filter(l => l.status === LeadStatus.Lost).length, fill: COLORS_PIPELINE.Lost },
    ];
    
    // Monochrome/Gold palette for Pie Charts
    const COLORS_GOLD_MONO = [
        '#ffcc29', // Gold Main
        '#e6b825', // Gold Dark
        '#18181b', // Black
        '#3f3f46', // Zinc 700
        '#71717a', // Zinc 500
        '#d4d4d8', // Zinc 300
    ];

    // Ensure contrasting colors for Pie Chart if in Dark Mode
    const PIE_COLORS = isDark 
        ? ['#ffcc29', '#e6b825', '#fafafa', '#a1a1aa', '#52525b', '#27272a'] 
        : ['#ffcc29', '#b38f1d', '#18181b', '#52525b', '#a1a1aa', '#d4d4d8'];

    const opportunityStagesData = Object.values(LeadStage).map(stage => ({
        name: stage,
        value: leads.filter(l => l.stage === stage && l.status === LeadStatus.Open).length,
    }));

    const leadSourceData = Object.values(LeadSource).map(source => ({
        name: source,
        value: leads.filter(l => l.source === source).length,
    })).sort((a, b) => b.value - a.value);
    
    const tooltipStyle = {
        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ffcc29', // Gold border for tooltip
        color: isDark ? '#f4f4f5' : '#18181b',
        backdropFilter: 'blur(4px)',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Projeções e Metas':
                return <ProjectionsTab leads={leads} />;
            case 'Tarefas':
                return <TasksTab tasks={tasks} />;
            case 'Agenda':
                return <AgendaTab events={calendarEvents} />;
            case 'Início':
            default:
                return (
                    <div className="space-y-6 animate-fadeInUp" style={{animationDuration: '0.3s'}}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total em vendas" value="R$48.231" subValue="+5.2% do mês passado" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} trendUp />
                            <StatCard title="Vendas fechadas" value="28" subValue="+3 este mês" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>} trendUp />
                            <StatCard title="Ticket médio" value={averageTicket} subValue="+1.2% do mês passado" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01" /></svg>} trendUp />
                            <StatCard title="Taxa de conversão" value="12.5%" subValue="-0.8% do mês passado" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                        </div>

                        {/* Pipeline Status Chart - Black & Gold Edition */}
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-lg h-96 flex flex-col border border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-semibold text-black dark:text-white mb-2">Pipeline de Vendas (Status)</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ffcc29" stopOpacity={1}/>
                                                <stop offset="95%" stopColor="#b38f1d" stopOpacity={1}/>
                                            </linearGradient>
                                            <linearGradient id="blackGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isDark ? "#f4f4f5" : "#27272a"} stopOpacity={1}/>
                                                <stop offset="95%" stopColor={isDark ? "#a1a1aa" : "#000000"} stopOpacity={1}/>
                                            </linearGradient>
                                            <linearGradient id="greyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isDark ? "#52525b" : "#a1a1aa"} stopOpacity={1}/>
                                                <stop offset="95%" stopColor={isDark ? "#27272a" : "#52525b"} stopOpacity={1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3f3f46" : "#e2e8f0"} vertical={false} />
                                        <XAxis dataKey="name" stroke={isDark ? "#a1a1aa" : "#6b7280"} fontSize={14} tickLine={false} axisLine={false} fontWeight="500" />
                                        <YAxis stroke={isDark ? "#a1a1aa" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{fill: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(228, 228, 231, 0.3)'}} contentStyle={tooltipStyle} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                            {pipelineData.map((entry, index) => {
                                                let fillId = 'url(#greyGradient)';
                                                if (entry.name === 'Ganho') fillId = 'url(#goldGradient)';
                                                if (entry.name === 'Aberto') fillId = 'url(#blackGradient)';
                                                return <Cell key={`cell-${index}`} fill={fillId} strokeWidth={0} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-lg h-80 flex flex-col border border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-semibold text-black dark:text-white">Oportunidades por Estágio</h3>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={opportunityStagesData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={60} 
                                                outerRadius={80} 
                                                stroke="none"
                                                paddingAngle={5}
                                            >
                                                {opportunityStagesData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingLeft: "10px"}} formatter={(value) => <span className="text-zinc-600 dark:text-zinc-400">{value}</span>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-black dark:text-white">{leads.filter(l => l.status === LeadStatus.Open).length}</span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">negócios</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-lg h-80 flex flex-col border border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-semibold text-black dark:text-white">Origem dos Leads</h3>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={leadSourceData.filter(d => d.value > 0)} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={60} 
                                                outerRadius={80} 
                                                stroke="none"
                                                paddingAngle={5}
                                            >
                                                {leadSourceData.filter(d => d.value > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingLeft: "10px"}} formatter={(value) => <span className="text-zinc-600 dark:text-zinc-400">{value}</span>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-black dark:text-white">{leads.length}</span>
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">total leads</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="space-y-6" ref={dashboardRef}>
            <header className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard de Vendas</h1>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/40?u=shreya" alt="User" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-black dark:text-white">Shreya Babulkar</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">SDR - VENDAS</p>
                        </div>
                     </div>
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={isDownloading}
                        className="bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold px-6 py-2 rounded-lg hover:from-primary-light hover:to-primary disabled:from-zinc-600 disabled:to-zinc-700 disabled:text-zinc-400 disabled:cursor-wait transition-colors"
                    >
                        {isDownloading ? 'Gerando PDF...' : 'Download'}
                    </button>
                </div>
            </header>

            <div className="bg-white dark:bg-zinc-900 p-1.5 rounded-xl flex gap-2 w-full md:w-auto self-start border border-zinc-200 dark:border-zinc-800">
                {['Início', 'Projeções e Metas', 'Tarefas', 'Agenda'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {renderContent()}

        </div>
    );
};
