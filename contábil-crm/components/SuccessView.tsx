import React from 'react';
import { Client, OnboardingStatus } from '../types';

interface SuccessViewProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
}

const getNpsCategory = (score?: number): { category: string; color: string; } => {
    if (score === undefined || score === null) return { category: 'N/A', color: 'bg-gray-500' };
    if (score >= 9) return { category: 'Promotor', color: 'bg-green-500' };
    if (score >= 7) return { category: 'Neutro', color: 'bg-yellow-500' };
    return { category: 'Detrator', color: 'bg-red-500' };
}

const calculateHealthScore = (client: Client): { 
    score: number; 
    color: string;
    breakdown: {
        base: number;
        nps: number;
        onboarding: number;
    }
} => {
    const base = 50;
    let score = base;
    let npsInfluence = 0;
    let onboardingInfluence = 0;

    // NPS Score influence
    if (client.npsScore !== undefined) {
        npsInfluence = (client.npsScore - 5) * 3;
    } else {
        npsInfluence = -10; // Penalize for no NPS
    }
    
    // Onboarding Status influence
    switch(client.onboardingStatus) {
        case OnboardingStatus.Active: onboardingInfluence = 20; break;
        case OnboardingStatus.SetupComplete: onboardingInfluence = 10; break;
        case OnboardingStatus.Prospect: onboardingInfluence = -20; break;
        default: onboardingInfluence = -5;
    }
    
    score += npsInfluence + onboardingInfluence;

    // Clip score between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    
    let color = 'bg-yellow-500';
    if (finalScore >= 75) color = 'bg-green-500';
    if (finalScore < 40) color = 'bg-red-500';

    return { 
        score: finalScore, 
        color,
        breakdown: {
            base: base,
            nps: Math.round(npsInfluence),
            onboarding: onboardingInfluence,
        }
    };
}

export const SuccessView: React.FC<SuccessViewProps> = ({ clients, onSelectClient }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-6">Métricas de Sucesso do Cliente</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Cliente</th>
              <th className="p-4 font-semibold text-center text-zinc-600 dark:text-zinc-400">Health Score</th>
              <th className="p-4 font-semibold text-left text-zinc-600 dark:text-zinc-400">Detalhes do Score</th>
              <th className="p-4 font-semibold text-center text-zinc-600 dark:text-zinc-400">NPS</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Categoria NPS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {clients.map((client) => {
                const nps = getNpsCategory(client.npsScore);
                const health = calculateHealthScore(client);
                return (
                    <tr key={client.id} onClick={() => onSelectClient(client.id)} className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-150">
                        <td className="p-4">
                            <p className="font-medium text-black dark:text-white">{client.companyName}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{client.name}</p>
                        </td>
                        <td className="p-4 text-center">
                           <div className="flex items-center justify-center gap-2">
                             <div className="w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                                <div className={`${health.color} h-2.5 rounded-full`} style={{width: `${health.score}%`}}></div>
                             </div>
                             <span className="font-semibold text-black dark:text-white">{health.score}</span>
                           </div>
                        </td>
                        <td className="p-4 text-sm">
                            <ul className="text-zinc-500 dark:text-zinc-400 space-y-0.5">
                                <li>Base: <span className="text-black dark:text-white font-medium">{health.breakdown.base}</span></li>
                                <li>Onboarding: <span className={health.breakdown.onboarding >= 0 ? 'text-green-500' : 'text-red-500'}>{health.breakdown.onboarding > 0 ? '+' : ''}{health.breakdown.onboarding}</span></li>
                                <li>NPS: <span className={health.breakdown.nps >= 0 ? 'text-green-500' : 'text-red-500'}>{health.breakdown.nps > 0 ? '+' : ''}{health.breakdown.nps}</span></li>
                            </ul>
                        </td>
                        <td className="p-4 text-center">
                            <span className={`font-bold ${nps.color.replace('bg','text')}`}>{client.npsScore ?? '-'}</span>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${nps.color}`}>
                                {nps.category}
                            </span>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};