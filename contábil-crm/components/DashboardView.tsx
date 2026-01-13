
import React, { useState, useEffect, useRef } from 'react';
import { Client, Task, OnboardingStatus, TaskStatus, Ticket, TicketStatus } from '../types';
import { ClientGrowthChart } from './ClientGrowthChart';
import { AiDashboardSummary } from './AiDashboardSummary';

interface DashboardViewProps {
  clients: Client[];
  tasks: Task[];
  tickets: Ticket[];
}

interface StatCardData {
    id: string;
    title: string;
    getValue: (clients: Client[], tasks: Task[], tickets: Ticket[]) => string | number;
    icon: React.ReactNode;
    color: string;
    isVisible: boolean;
}

const initialCardConfig: StatCardData[] = [
    {
        id: 'newClients',
        title: "Novos Clientes (Mês)",
        getValue: (clients) => {
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            return clients.filter(c => {
                const joinDate = new Date(c.joinedDate);
                return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
            }).length;
        },
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
        color: "text-blue-500 bg-blue-500/10",
        isVisible: true,
    },
    {
        id: 'pendingOnboardings',
        title: "Onboardings Ativos",
        getValue: (clients) => clients.filter(c => c.onboardingStatus === OnboardingStatus.Onboarding || c.onboardingStatus === OnboardingStatus.SetupComplete).length,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
        color: "text-primary bg-primary/10",
        isVisible: true,
    },
    {
        id: 'upcomingDeadlines',
        title: "Prazos Próximos (7d)",
        getValue: (clients, tasks) => {
            return tasks.filter(t => {
                const due = new Date(t.dueDate);
                const today = new Date();
                const oneWeekFromNow = new Date(new Date().setDate(today.getDate() + 7));
                return due >= today && due <= oneWeekFromNow && t.status !== TaskStatus.Done;
            }).length;
        },
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>,
        color: "text-red-500 bg-red-500/10",
        isVisible: true,
    },
    {
        id: 'openTickets',
        title: "Chamados Abertos",
        getValue: (clients, tasks, tickets) => tickets.filter(t => t.status === TicketStatus.Open).length,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
        color: "text-purple-500 bg-purple-500/10",
        isVisible: true,
    }
];

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isEditing: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
  style?: React.CSSProperties;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
}> = ({ title, value, icon, color, isEditing, isVisible, onToggleVisibility, style, className, ...dragProps }) => (
  <div
    style={style}
    className={`relative bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg flex items-center gap-6 transition-all duration-300 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl ${isEditing ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/50' : ''} ${!isVisible && isEditing ? 'opacity-40' : ''} ${className}`}
    draggable={isEditing}
    {...dragProps}
  >
    {isEditing && (
      <button
        onClick={onToggleVisibility}
        className="absolute top-2 right-2 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white z-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1"
        aria-label={isVisible ? 'Ocultar card' : 'Mostrar card'}
      >
        {isVisible ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 2 12s3 7 10 7a9 9 0 0 0 5.39-1.81"/><path d="M2 2l20 20"/><path d="M15.41 15.41A4 4 0 0 1 12 16a4 4 0 0 1-4-4c0-.39.07-.75.22-1.09"/><path d="M10.58 4.63A11.3 11.3 0 0 1 12 5c7 0 10 7 10 7a13.14 13.14 0 0 1-1.59 2.41"/><path d="M4 8.5V4a1 1 0 0 1 1-1h3.5"/></svg>
        )}
      </button>
    )}
    <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-black dark:text-white text-3xl font-black mt-1">{value}</p>
    </div>
  </div>
);

const getInitialCardState = (): StatCardData[] => {
    try {
        const savedConfig = localStorage.getItem('dashboardCardConfig');
        if (savedConfig) {
            const parsedConfig: {id: string, isVisible: boolean}[] = JSON.parse(savedConfig);
            const savedOrder = parsedConfig.map(c => c.id);
            
            const initialMap = new Map(initialCardConfig.map(c => [c.id, c]));

            const finalConfig = savedOrder.map(id => {
                const initialCard = initialMap.get(id);
                const savedCard = parsedConfig.find(c => c.id === id);
                if (initialCard && savedCard) {
                    return { ...initialCard, isVisible: savedCard.isVisible };
                }
                return null;
            }).filter((c): c is StatCardData => c !== null);

            initialCardConfig.forEach(initialCard => {
                if (!finalConfig.some(c => c.id === initialCard.id)) {
                    finalConfig.push(initialCard);
                }
            });

            return finalConfig;
        }
    } catch (error) {
        console.error("Failed to parse dashboard config from localStorage", error);
    }
    return initialCardConfig;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ clients, tasks, tickets }) => {
  const [cardConfig, setCardConfig] = useState<StatCardData[]>(getInitialCardState);
  const [isEditing, setIsEditing] = useState(false);

  const draggedItem = useRef<number | null>(null);
  const draggedOverItem = useRef<number | null>(null);
  
  useEffect(() => {
    try {
        const configToSave = cardConfig.map(({ id, isVisible }) => ({ id, isVisible }));
        localStorage.setItem('dashboardCardConfig', JSON.stringify(configToSave));
    } catch (error) {
        console.error("Failed to save dashboard config to localStorage", error);
    }
  }, [cardConfig]);

  const handleToggleVisibility = (id: string) => {
    setCardConfig(prevConfig =>
      prevConfig.map(card =>
        card.id === id ? { ...card, isVisible: !card.isVisible } : card
      )
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    draggedItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    draggedOverItem.current = index;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    if (draggedItem.current !== null && draggedOverItem.current !== null) {
       handleDrop();
    }
    draggedItem.current = null;
    draggedOverItem.current = null;
  };

  const handleDrop = () => {
    if (draggedItem.current === null || draggedOverItem.current === null) return;
    const newConfig = [...cardConfig];
    const draggedItemContent = newConfig.splice(draggedItem.current, 1)[0];
    newConfig.splice(draggedOverItem.current, 0, draggedItemContent);
    setCardConfig(newConfig);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">Painel Executivo</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 transform active:scale-95 shadow-lg hover:shadow-xl ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
             {isEditing ? 'Salvar Layout' : 'Configurar'}
          </button>
      </div>

      <AiDashboardSummary clients={clients} tasks={tasks} tickets={tickets} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((card, index) => {
          if (!card.isVisible && !isEditing) return null;
          
          return (
            <StatCard
              key={card.id}
              title={card.title}
              value={card.getValue(clients, tasks, tickets)}
              icon={card.icon}
              color={card.color}
              isEditing={isEditing}
              isVisible={card.isVisible}
              onToggleVisibility={() => handleToggleVisibility(card.id)}
              style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
              className="animate-fadeInUp"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            />
          );
        })}
      </div>
      
      <ClientGrowthChart clients={clients} />
    </div>
  );
};
