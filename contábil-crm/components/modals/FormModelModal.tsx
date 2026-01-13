
import React, { useState } from 'react';
import { FormModel, FormField } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface FormModelModalProps {
    onClose: () => void;
    onSave: (form: FormModel) => void;
}

const FormSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="bg-primary text-zinc-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                {number}
            </span>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-white uppercase tracking-wide">
                {title}
            </h3>
        </div>
        <div>
            {children}
        </div>
    </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputBaseClass = "w-full bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

export const FormModelModal: React.FC<FormModelModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState<FormField[]>([]);

    const addField = () => {
        setFields([...fields, { id: uuidv4(), label: '', type: 'text', required: true }]);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: uuidv4(),
            name,
            description,
            fields
        });
    };

    return (
        <div className="fixed inset-0 z-[500] bg-zinc-50 dark:bg-zinc-950 flex flex-col animate-fadeInUp overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full py-12 px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Novo Modelo de Formulário</h1>
                        <p className="text-zinc-600 dark:text-zinc-500 text-lg">Crie formulários para coleta de dados de leads e clientes.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 font-medium transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Cancelar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Identificação */}
                    <FormSection number="1" title="Definição do Formulário">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Nome do Formulário" required>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Qualificação de Lead - Tributário" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    className={inputBaseClass} 
                                    required 
                                    autoFocus
                                />
                            </Field>
                            <Field label="Descrição Curta">
                                <input 
                                    type="text" 
                                    placeholder="Para que serve este formulário?" 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    className={inputBaseClass}
                                />
                            </Field>
                        </div>
                    </FormSection>

                    {/* 2. Construtor de Campos */}
                    <FormSection number="2" title="Estrutura de Perguntas">
                        <div className="space-y-4 mb-6">
                            {fields.map((field, index) => (
                                <div key={field.id} className="bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl flex flex-wrap gap-4 items-end animate-fadeInUp shadow-sm">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Pergunta {index + 1}</label>
                                        <input 
                                            type="text" 
                                            value={field.label} 
                                            onChange={e => updateField(field.id, { label: e.target.value })}
                                            placeholder="Digite a pergunta..." 
                                            className={inputBaseClass}
                                            required
                                        />
                                    </div>
                                    <div className="w-40">
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Tipo de Resposta</label>
                                        <select 
                                            value={field.type} 
                                            onChange={e => updateField(field.id, { type: e.target.value as any })}
                                            className={inputBaseClass}
                                        >
                                            <option value="text">Texto Curto</option>
                                            <option value="textarea">Texto Longo</option>
                                            <option value="number">Número</option>
                                            <option value="date">Data</option>
                                            <option value="select">Seleção</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input 
                                            type="checkbox" 
                                            checked={field.required} 
                                            onChange={e => updateField(field.id, { required: e.target.checked })}
                                            className="w-4 h-4 rounded text-primary focus:ring-primary bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                                        />
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Obrigatória</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeField(field.id)}
                                        className="mb-1 p-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            type="button" 
                            onClick={addField}
                            className="w-full py-4 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-500 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Adicionar Nova Pergunta
                        </button>
                    </FormSection>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 mt-12 pb-12">
                        <button type="button" onClick={onClose} className="px-8 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all">
                            Descartar
                        </button>
                        <button type="submit" className="px-8 py-3 bg-primary text-zinc-900 font-bold rounded-xl hover:bg-primary-light transition-all transform active:scale-95 shadow-lg shadow-primary/20">
                            Publicar Modelo de Formulário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
