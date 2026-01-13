
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { User, UserRole } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    activeView: string;
    setActiveView: (view: string) => void;
    isAddingClient?: boolean;
    onLogout: () => void;
    currentUser: User | null;
}

const navItems = {
    "Gestão de Clientes": [
        { name: 'Clientes', icon: 'users' },
        { name: 'Lista de Clientes', icon: 'list' },
        { name: 'Onboarding', icon: 'onboarding' },
        { name: 'Tarefas', icon: 'tasks' },
        { name: 'Calendário', icon: 'calendar' },
        { name: 'Modelos de Onboarding', icon: 'flow' },
    ],
    "Engajamento": [
        { name: 'Sucesso', icon: 'success' },
        { name: 'Comunicação', icon: 'message' },
        { name: 'Suporte', icon: 'support' },
        { name: 'BVCs', icon: 'briefcase' },
    ],
    "Vendas & Marketing": [
        { name: 'Dashboard Vendas', icon: 'chart' },
        { name: 'Leads', icon: 'target' },
        { name: 'Pipeline', icon: 'pipeline' },
        { name: 'Automações', icon: 'zap' },
        { name: 'Formulários', icon: 'forms' },
    ]
};

const Icons: Record<string, React.ReactNode> = {
    users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M23 7a4 4 0 0 0-4.65-3.89"/></svg>,
    list: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    onboarding: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="m9.05 14.87-2.01-2.01"/><path d="m14.91 8.91 2.01-2.01"/></svg>,
    tasks: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    flow: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>,
    success: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    message: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    support: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    chart: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
    target: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    pipeline: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>,
    zap: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    forms: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    cog: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
};

const LOGO_LIGHT_URL = "https://i.imgur.com/Lj6oSbu.png";
const LOGO_DARK_URL = "https://i.imgur.com/jn1yd0P.png";

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, isAddingClient, onLogout, currentUser }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-zinc-100/50 dark:bg-transparent">
            {/* Sidebar */}
            <aside className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo and toggle */}
                 <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 h-20 flex-shrink-0">
                    {isSidebarOpen && (
                        <img 
                            src={theme === 'dark' ? LOGO_DARK_URL : LOGO_LIGHT_URL} 
                            alt="L&M Contabilidade" 
                            className="h-16 w-auto object-contain transition-all duration-300"
                        />
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
                        {isSidebarOpen ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        }
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {Object.entries(navItems).map(([category, items]) => (
                        <div key={category}>
                            {isSidebarOpen && <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-2">{category}</h3>}
                            <ul className="space-y-1">
                                {items.map(item => (
                                    <li key={item.name}>
                                        <button onClick={() => setActiveView(item.name)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all ${activeView === item.name ? 'bg-primary text-zinc-900 font-bold shadow-lg shadow-primary/20' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'}`}>
                                            <span className="flex-shrink-0">{Icons[item.icon]}</span>
                                            {isSidebarOpen && <span className="truncate">{item.name}</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {currentUser?.role === UserRole.Admin && (
                        <div>
                            {isSidebarOpen && <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-2">Administração</h3>}
                            <ul className="space-y-1">
                                <li>
                                    <button onClick={() => setActiveView('Usuários')} className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all ${activeView === 'Usuários' ? 'bg-primary text-zinc-900 font-bold shadow-lg shadow-primary/20' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'}`}>
                                        <span className="flex-shrink-0">{Icons['cog']}</span>
                                        {isSidebarOpen && <span className="truncate">Usuários</span>}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen ? 'flex-col justify-center' : ''}`}>
                        <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}`} alt="User" className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700" />
                        {isSidebarOpen && (
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-black dark:text-white truncate text-xs">{currentUser?.name}</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate uppercase tracking-tighter">{currentUser?.role}</p>
                            </div>
                        )}
                        <div className={`flex ${!isSidebarOpen ? 'flex-col gap-2' : 'gap-1 flex-shrink-0'}`}>
                            <button 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                aria-label="Trocar Tema"
                            >
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                                )}
                            </button>
                            <button onClick={onLogout} className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" aria-label="Sair">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Header */}
                 <header className={`flex items-center justify-between p-4 h-16 flex-shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 ${isAddingClient ? 'hidden' : ''}`}>
                    <div className="text-xs font-medium text-zinc-400">
                        CONTÁBIL CRM / <span className="text-black dark:text-white uppercase tracking-widest font-black">{activeView}</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                         </button>
                    </div>
                 </header>

                 {/* Page Content */}
                 <main className="flex-1 overflow-y-auto p-8">
                     {children}
                 </main>
            </div>
        </div>
    );
}
