

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Client, AcquisitionChannel } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface AcquisitionChannelChartProps {
    clients: Client[];
}

const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#14b8a6', '#ec4899'];

export const AcquisitionChannelChart: React.FC<AcquisitionChannelChartProps> = ({ clients }) => {
    const data = useMemo(() => {
        // FIX: Cast initial value to Record<string, number> to ensure reduce return type is correct for TypeScript inference
        const channelCounts = clients.reduce((acc, client) => {
            if (client.acquisitionChannel) {
                acc[client.acquisitionChannel] = (acc[client.acquisitionChannel] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(channelCounts)
            .map(([name, value]) => ({ name, value: Number(value) }))
            .sort((a, b) => b.value - a.value);
    }, [clients]);

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
         <div className="h-full w-full flex flex-col">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Canais de Aquisição</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        layout="vertical"
                    >
                        <XAxis type="number" hide />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            stroke={isDark ? "#a1a1aa" : "#4b5563"}
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            width={80}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(228, 228, 231, 0.5)' }}
                             contentStyle={{
                                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                borderColor: isDark ? '#3f3f46' : '#e5e7eb',
                                color: isDark ? '#f4f4f5' : '#18181b',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                             <LabelList dataKey="value" position="right" style={{ fill: isDark ? '#f4f4f5' : '#1f2937', fontSize: '12px', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};