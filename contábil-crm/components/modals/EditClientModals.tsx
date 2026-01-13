import React, { useState, useEffect } from 'react';
import { Client, ClientPlan, AcquisitionChannel, TaxRegime, OnboardingStatus, ClientStage } from '../../types';
import { ACCOUNTING_RESPONSIBLES } from '../../constants';

interface EditClientInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedInfo: Partial<Client>) => void;
    client: Client;
    section: 'contact' | 'management' | 'accounting';
}

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">{label}</label>
        {children}
    </div>
);
const inputStyles = "w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white";

export const EditClientInfoModal: React.FC<EditClientInfoModalProps> = ({ isOpen, onClose, onSave, client, section }) => {
    const [formData, setFormData] = useState<Partial<Client>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...client });
        }
    }, [isOpen, client]);

    const handleChange = (field: keyof Client, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;
    
    const sectionTitles = {
        contact: 'Editar Informações de Contato',
        management: 'Editar Informações Gerenciais',
        accounting: 'Editar Informações Contábeis, Fiscais e Pessoais'
    };

    const renderFormContent = () => {
        switch (section) {
            case 'contact':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Nome"><input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Telefone"><input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Email"><input type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Estado"><input value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Cidade"><input value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Canal de Aquisição">
                             <select value={formData.acquisitionChannel || ''} onChange={e => handleChange('acquisitionChannel', e.target.value as AcquisitionChannel)} className={inputStyles}>
                                {Object.values(AcquisitionChannel).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </FormField>
                    </div>
                );
            case 'management':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Plano">
                           <select value={formData.plan || ''} onChange={e => handleChange('plan', e.target.value as ClientPlan)} className={inputStyles}>
                                {Object.values(ClientPlan).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Honorário"><input type="text" value={formData.fee || ''} onChange={e => handleChange('fee', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Categoria"><input value={formData.category || ''} onChange={e => handleChange('category', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Segmento"><input value={formData.segmento || ''} onChange={e => handleChange('segmento', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Etapa">
                             <select value={formData.stage || ''} onChange={e => handleChange('stage', e.target.value as ClientStage)} className={`${inputStyles} capitalize`}>
                                {Object.values(ClientStage).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </FormField>
                         <FormField label="Status Onboarding">
                             <select value={formData.onboardingStatus || ''} onChange={e => handleChange('onboardingStatus', e.target.value as OnboardingStatus)} className={inputStyles}>
                                {Object.values(OnboardingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </FormField>
                    </div>
                );
            case 'accounting':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="CNPJ"><input value={formData.cnpj || ''} onChange={e => handleChange('cnpj', e.target.value)} className={inputStyles} /></FormField>
                        <FormField label="Regime Tributário">
                            <select value={formData.taxRegime || ''} onChange={e => handleChange('taxRegime', e.target.value as TaxRegime)} className={inputStyles}>
                                {Object.values(TaxRegime).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Responsável Contábil">
                             <select value={formData.accountingResponsible || ''} onChange={e => handleChange('accountingResponsible', e.target.value)} className={inputStyles}>
                                {ACCOUNTING_RESPONSIBLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Grupo"><input value={formData.group || ''} onChange={e => handleChange('group', e.target.value)} className={inputStyles} /></FormField>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeInUp" style={{animationDuration: '0.2s'}}>
            <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-700/50">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{sectionTitles[section]}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFormContent()}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-br from-primary to-primary-dark text-zinc-900 font-bold rounded-md hover:from-primary-light hover:to-primary transition-all">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};