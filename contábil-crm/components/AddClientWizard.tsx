
import React, { useState } from 'react';
import { NewClientData, ClientPlan, AcquisitionChannel, OnboardingStatus, TaxRegime, EntryProcess } from '../types';

interface AddClientWizardProps {
    addClient: (client: NewClientData) => void;
    onFinish: () => void;
}

const ESTADOS_BRASIL = [
    { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' }, { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Pará' }, { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' }, { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' }, { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' }, { uf: 'TO', nome: 'Tocantins' }
];

const initialFormData: NewClientData = {
    name: '',
    plan: ClientPlan.DecolaEmpresa,
    responsibleName: '',
    responsibleId: '',
    email: '',
    phone: '',
    state: 'SP',
    city: '',
    acquisitionChannel: AcquisitionChannel.Indicação,
    product: ClientPlan.DecolaEmpresa,
    companyName: '',
    cnpj: '',
    domainCode: '',
    category: '',
    fee: '0.00',
    status: OnboardingStatus.Onboarding,
    entryDate: new Date().toISOString().split('T')[0],
    taxRegime: TaxRegime.Indefinido,
    group: '',
    entryProcess: EntryProcess.Abertura,
    departmentResponsible: '',
    hasEmployee: 'Não',
    proLabore: 'Não',
    hasCertificate: 'Não',
    fiscalDepartmentResponsible: '',
    rFactor: 'Não',
    mainBranch: '',
    secondaryBranch: '',
    annex: 'Não se aplica',
    secondaryAnnex: 'Não se aplica',
    stateRegistration: '',
    municipalRegistration: '',
    accountingDepartmentResponsible: '',
    closing: '',
    useContaAzul: 'Não',
    banks: [],
};

const FormSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <span className="bg-primary text-zinc-900 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                {number}
            </span>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                {title}
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputBaseClass = "w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-2xl px-5 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium";

export const AddClientWizard: React.FC<AddClientWizardProps> = ({ addClient, onFinish }) => {
    const [formData, setFormData] = useState<NewClientData>(initialFormData);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleUpdate = (field: keyof NewClientData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addClient(formData);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto mt-20 bg-white dark:bg-zinc-900 p-16 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 text-center shadow-2xl animate-fadeInUp">
                <div className="bg-primary w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-xl shadow-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Sucesso Total!</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 font-medium">O novo cliente já faz parte da sua base de dados e está pronto para o onboarding.</p>
                <button onClick={onFinish} className="w-full bg-primary text-zinc-900 font-black py-5 rounded-2xl hover:bg-primary-light transition-all transform active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                    Ver Painel de Clientes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fadeInUp">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Novo Cadastro</h1>
                    <p className="text-zinc-500 dark:text-zinc-500 text-xl font-medium">Registre todas as informações vitais do novo cliente.</p>
                </div>
                <button onClick={onFinish} className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-2xl font-bold transition-all flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    Cancelar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                <FormSection number="1" title="Contato e Localização">
                    <Field label="Responsável Principal" required>
                        <input type="text" placeholder="Ex: João Silva" value={formData.responsibleName} onChange={e => handleUpdate('responsibleName', e.target.value)} className={inputBaseClass} required />
                    </Field>
                    <Field label="E-mail de Contato">
                        <input type="email" placeholder="email@exemplo.com" value={formData.email} onChange={e => handleUpdate('email', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="Telefone/WhatsApp">
                        <input type="text" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => handleUpdate('phone', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="Estado (UF)" required>
                        <select value={formData.state} onChange={e => handleUpdate('state', e.target.value)} className={inputBaseClass} required>
                            {ESTADOS_BRASIL.map(estado => (
                                <option key={estado.uf} value={estado.uf}>{estado.nome}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Cidade" required>
                        <input type="text" placeholder="Nome da cidade" value={formData.city} onChange={e => handleUpdate('city', e.target.value)} className={inputBaseClass} required />
                    </Field>
                    <Field label="Origem (Canal)" required>
                        <select value={formData.acquisitionChannel} onChange={e => handleUpdate('acquisitionChannel', e.target.value as AcquisitionChannel)} className={inputBaseClass} required>
                            {Object.values(AcquisitionChannel).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>
                </FormSection>

                <FormSection number="2" title="Negócio e Contrato">
                    <Field label="Razão Social">
                        <input type="text" placeholder="Nome empresarial" value={formData.companyName} onChange={e => handleUpdate('companyName', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="CNPJ">
                        <input type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => handleUpdate('cnpj', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="Plano Selecionado" required>
                        <select value={formData.product} onChange={e => handleUpdate('product', e.target.value as ClientPlan)} className={inputBaseClass} required>
                            {Object.values(ClientPlan).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </Field>
                    <Field label="Mensalidade (R$)">
                        <input type="text" placeholder="0.00" value={formData.fee} onChange={e => handleUpdate('fee', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="Data de Início">
                        <input type="date" value={formData.entryDate} onChange={e => handleUpdate('entryDate', e.target.value)} className={inputBaseClass} />
                    </Field>
                    <Field label="Status Inicial" required>
                        <select value={formData.status} onChange={e => handleUpdate('status', e.target.value as OnboardingStatus)} className={inputBaseClass} required>
                            {Object.values(OnboardingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>
                </FormSection>

                <div className="flex justify-end gap-6 mt-12 pb-24 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                    <button type="button" onClick={onFinish} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all">
                        Descartar Alterações
                    </button>
                    <button type="submit" className="px-12 py-5 bg-primary text-zinc-900 font-black rounded-2xl hover:bg-primary-light transition-all transform active:scale-95 shadow-xl shadow-primary/20 flex items-center gap-4 uppercase tracking-widest text-sm">
                        <span>Finalizar Cadastro</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>

            </form>
        </div>
    );
};
