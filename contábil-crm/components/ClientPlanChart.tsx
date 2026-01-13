
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Client, ClientPlan } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ClientPlanChartProps {
    clients: Client[];
}

const PLAN_COLORS: Record<string, string> = {
    'Decola Obrigações': '#9ca3af', // Prata/Cinza (gray-400)
    'Decola Empresa': '#ffcc29', // Dourado/Amarelo (marca)
    'Decola Lucro': '#1f2937', // Preto/Cinza Escuro (gray-800)
};

const FALLBACK_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ec4899'];

export const ClientPlanChart: React.FC<ClientPlanChartProps> = ({ clients }) => {
    const data = useMemo(() => {
        const planCounts = clients.reduce((acc, client) => {
            acc[client.plan] = (acc[client.plan] || 0) + 1;
            return acc;
        }, {} as Record<ClientPlan, number>);

        return Object.entries(planCounts).map(([name, value]) => ({ name, value }));
    }, [clients]);

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="h-full w-full flex flex-col">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Clientes por plano/produto</h3>
            <div className="flex-grow">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                             formatter={(value, name) => [`${value} (${((value as number / clients.length) * 100).toFixed(1)}%)`, name]}
                             contentStyle={{
                                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                borderColor: isDark ? '#3f3f46' : '#e5e7eb',
                                color: isDark ? '#f4f4f5' : '#18181b',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Legend 
                            layout="vertical" 
                            align="right" 
                            verticalAlign="middle"
                            iconType="circle"
                            formatter={(value, entry) => <span className="text-zinc-600 dark:text-zinc-400">{`${value} (${entry.payload.value})`}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
