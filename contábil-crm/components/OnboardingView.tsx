
import React, { useState } from 'react';
import { Client, OnboardingStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface OnboardingViewProps {
  clients: Client[];
  updateClientStatus: (clientId: string, status: OnboardingStatus) => void;
  onSelectClient: (clientId: string) => void;
  onGoToModels: () => void;
}

const OnboardingColumn: React.FC<{
  status: OnboardingStatus;
  clients: Client[];
  onDrop: (status: OnboardingStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, clientId: string) => void;
  onSelectClient: (clientId: string) => void;
}> = ({ status, clients, onDrop, onDragOver, onDragStart, onSelectClient }) => {
  return (
    <div
      onDrop={() => onDrop(status)}
      onDragOver={onDragOver}
      className="bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm w-80 rounded-xl p-4 flex flex-col flex-shrink-0 border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-black dark:text-white">{status}</h3>
        <span className="text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full px-2.5 py-1 font-medium">{clients.length}</span>
      </div>
      <div className="space-y-3 overflow-y-auto flex-grow pr-2 -mr-2">
        {clients.map(client => (
          <div
            key={client.id}
            draggable
            onDragStart={(e) => onDragStart(e, client.id)}
            onClick={() => onSelectClient(client.id)}
            className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-primary-light dark:hover:border-primary-dark transition-all duration-200 transform hover:-translate-y-1"
          >
            <p className="font-semibold text-black dark:text-white">{client.companyName}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{client.name}</p>
            <div className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[client.onboardingStatus]}`}>
                {client.onboardingStatus}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OnboardingView: React.FC<OnboardingViewProps> = ({ clients, updateClientStatus, onSelectClient, onGoToModels }) => {
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, clientId: string) => {
    setDraggedClientId(clientId);
  };

  const handleDrop = (targetStatus: OnboardingStatus) => {
    if (draggedClientId) {
      updateClientStatus(draggedClientId, targetStatus);
      setDraggedClientId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onboardingStages = [
    OnboardingStatus.Prospect,
    OnboardingStatus.Onboarding,
    OnboardingStatus.SetupComplete,
    OnboardingStatus.Active,
    OnboardingStatus.Churned,
  ];

  return (
    <div className="flex flex-col h-full -m-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Pipeline de Onboarding</h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie a entrada de novos clientes com fluidez.</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={onGoToModels}
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold px-4 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                Personalizar Fluxos
            </button>
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-4 flex-grow scrollbar-hide">
        {onboardingStages.map(status => (
          <OnboardingColumn
            key={status}
            status={status}
            clients={clients.filter(c => c.onboardingStatus === status)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onSelectClient={onSelectClient}
          />
        ))}
      </div>
    </div>
  );
};
