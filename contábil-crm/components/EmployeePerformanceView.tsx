
import React, { useMemo } from 'react';
import { Client } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface EmployeePerformanceViewProps {
    clients: Client[];
}

export const EmployeePerformanceView: React.FC<EmployeePerformanceViewProps> = ({ clients }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const data = useMemo(() => {
        const stats: Record<string, { name: string; clientCount: number; totalFee: number }> = {};

        clients.forEach(client => {
            const responsible = client.accountingResponsible || 'Não atribuído';
            
            if (!stats[responsible]) {
                stats[responsible] = { name: responsible, clientCount: 0, totalFee: 0 };
            }

            stats[responsible].clientCount += 1;
            
            const feeValue = parseFloat(client.fee) || 0;
            stats[responsible].totalFee += feeValue;
        });

        return Object.values(stats)
            .map(stat => ({
                ...stat,
                averageTicket: stat.clientCount > 0 ? stat.totalFee / stat.clientCount : 0
            }))
            .sort((a, b) => b.totalFee - a.totalFee); // Sort by highest revenue
    }, [clients]);

    const totalRevenue = data.reduce((sum, item) => sum + item.totalFee, 0);

    return (
        <div className="space-y-8 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-black dark:text-white">Valorização de Funcionários & Margem</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Receita Total por Responsável</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3f3f46" : "#e2e8f0"} horizontal={false} />
                                <XAxis type="number" stroke={isDark ? "#a1a1aa" : "#52525b"} tickFormatter={(val) => `R$${val/1000}k`} />
                                <YAxis dataKey="name" type="category" stroke={isDark ? "#a1a1aa" : "#52525b"} width={100} />
                                <Tooltip 
                                    cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                                    contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#3f3f46' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                                    formatter={(val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                />
                                <Legend />
                                <Bar dataKey="totalFee" name="Receita Total" fill="#ffcc29" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Client Count Chart */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Quantidade de Empresas (Carteira)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3f3f46" : "#e2e8f0"} horizontal={false} />
                                <XAxis type="number" stroke={isDark ? "#a1a1aa" : "#52525b"} />
                                <YAxis dataKey="name" type="category" stroke={isDark ? "#a1a1aa" : "#52525b"} width={100} />
                                <Tooltip 
                                    cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
                                    contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#3f3f46' : '#e5e7eb', color: isDark ? '#fff' : '#000' }}
                                />
                                <Legend />
                                <Bar dataKey="clientCount" name="Qtd. Empresas" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-lg font-semibold text-black dark:text-white">Detalhamento da Carteira</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                            <tr>
                                <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Funcionário</th>
                                <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Qtd. Clientes</th>
                                <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Receita Total</th>
                                <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Ticket Médio</th>
                                <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">% da Receita</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4 font-medium text-black dark:text-white">{row.name}</td>
                                    <td className="p-4 text-zinc-600 dark:text-zinc-300 text-right">{row.clientCount}</td>
                                    <td className="p-4 text-green-600 dark:text-green-400 font-bold text-right">{row.totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="p-4 text-zinc-600 dark:text-zinc-300 text-right">{row.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="p-4 text-zinc-600 dark:text-zinc-300 text-right">{((row.totalFee / totalRevenue) * 100).toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
