import React, { useState } from 'react';
import { Lead, LeadStage } from '../types';

interface SalesPipelineViewProps {
  leads: Lead[];
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
}

const LeadCard: React.FC<{ lead: Lead; onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void }> = ({ lead, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, lead.id)}
        className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 cursor-grab active:cursor-grabbing transform hover:border-primary-light dark:hover:border-primary-dark transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
    >
        <p className="font-semibold text-black dark:text-white truncate">{lead.company}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{lead.name}</p>
        <div className="flex justify-between items-center mt-3">
             <p className="text-sm text-green-500 dark:text-green-400 font-bold">{lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
             <span className="text-xs bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-full">{lead.source}</span>
        </div>
    </div>
);

const PipelineColumn: React.FC<{
    stage: LeadStage;
    leads: Lead[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, stage: LeadStage) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ stage, leads, onDragStart, onDrop, onDragOver }) => {
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

    return (
        <div
            className="bg-zinc-100 dark:bg-zinc-950 w-80 rounded-xl p-4 flex flex-col flex-shrink-0 border border-zinc-200 dark:border-zinc-800"
            onDrop={(e) => onDrop(e, stage)}
            onDragOver={onDragOver}
        >
            <div className="flex items-start justify-between mb-4 px-1 flex-shrink-0">
                <div>
                    <h3 className="font-semibold text-black dark:text-white text-lg capitalize">{stage}</h3>
                    <p className="text-sm text-green-500 dark:text-green-400 font-bold mt-1">
                        {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                    </p>
                </div>
                <span className="text-sm bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-full px-2.5 py-1 font-medium">{leads.length}</span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 -mr-2 flex-grow">
                {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onDragStart={onDragStart} />
                ))}
            </div>
        </div>
    );
};


export const SalesPipelineView: React.FC<SalesPipelineViewProps> = ({ leads, updateLeadStage }) => {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: LeadStage) => {
        e.preventDefault();
        if (draggedLeadId) {
            updateLeadStage(draggedLeadId, targetStage);
            setDraggedLeadId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const pipelineStages = Object.values(LeadStage);

    return (
        <div className="flex flex-col h-full -m-8 p-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-6 flex-shrink-0">Pipeline de Vendas</h1>
            <div className="flex gap-6 overflow-x-auto pb-4 flex-grow">
                {pipelineStages.map(stage => (
                    <PipelineColumn
                        key={stage}
                        stage={stage}
                        leads={leads.filter(l => l.stage === stage)}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                ))}
            </div>
        </div>
    );
};