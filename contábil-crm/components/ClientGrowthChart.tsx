
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Client } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ClientGrowthChartProps {
  clients: Client[];
}

const processData = (clients: Client[]) => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyData: { [key: string]: number } = {};
    const today = new Date();
    
    for(let i=11; i>=0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;
        monthlyData[key] = 0;
    }
    
    let cumulativeClients = 0;
    const sortedClients = [...clients].sort((a,b) => a.joinedDate.getTime() - b.joinedDate.getTime());
    
    const startOfPeriod = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    
    cumulativeClients = sortedClients.filter(c => c.joinedDate < startOfPeriod).length;

    Object.keys(monthlyData).forEach(key => {
        const [monthStr, yearStr] = key.split('/');
        const month = monthNames.indexOf(monthStr);
        const year = parseInt(`20${yearStr}`);
        const monthStart = new Date(year, month, 1);
        const nextMonthStart = new Date(year, month + 1, 1);
        
        const newClientsThisMonth = sortedClients.filter(c => c.joinedDate >= monthStart && c.joinedDate < nextMonthStart).length;
        
        cumulativeClients += newClientsThisMonth;
        monthlyData[key] = cumulativeClients;
    });

    return Object.entries(monthlyData).map(([name, total]) => ({ name, Clientes: total }));
}

export const ClientGrowthChart: React.FC<ClientGrowthChartProps> = ({ clients }) => {
  const data = processData(clients);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg h-96 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Crescimento de Clientes (Últimos 12 meses)</h3>
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3f3f46" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={isDark ? "#a1a1aa" : "#52525b"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#a1a1aa" : "#52525b"} fontSize={12} allowDecimals={false} tickLine={false} axisLine={false}/>
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        borderColor: isDark ? '#3f3f46' : '#e5e7eb',
                        color: isDark ? '#f4f4f5' : '#18181b',
                        borderRadius: '0.5rem',
                        backdropFilter: 'blur(4px)',
                    }}
                />
                <Legend wrapperStyle={{fontSize: "14px", paddingTop: "10px"}} />
                <Area type="monotone" dataKey="Clientes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  );
};
