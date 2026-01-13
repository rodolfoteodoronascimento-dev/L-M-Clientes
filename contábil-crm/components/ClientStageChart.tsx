import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Client, ClientStage } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ClientStageChartProps {
    clients: Client[];
}

const COLORS: Record<ClientStage, string> = {
    [ClientStage.Onboarding]: '#3b82f6', // blue-500
    [ClientStage.Societario]: '#14b8a6', // teal-500
    [ClientStage.Adocao]: '#22c55e', // green-500
    [ClientStage.Operacao]: '#8b5cf6', // violet-500
};

export const ClientStageChart: React.FC<ClientStageChartProps> = ({ clients }) => {
    const data = useMemo(() => {
        const stageCounts = clients.reduce((acc, client) => {
            acc[client.stage] = (acc[client.stage] || 0) + 1;
            return acc;
        }, {} as Record<ClientStage, number>);

        return Object.entries(stageCounts).map(([name, value]) => ({ name, value, fill: COLORS[name as ClientStage] }));
    }, [clients]);
    
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="h-full w-full flex flex-col">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Clientes por Etapa</h3>
            <div className="flex-grow">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={50}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
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
                            formatter={(value, entry) => <span className="text-zinc-600 dark:text-zinc-400 capitalize">{`${value} (${entry.payload.value})`}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};