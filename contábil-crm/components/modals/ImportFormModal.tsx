
import React, { useState } from 'react';
import { FormModel } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { extractFormFromFile } from '../../services/geminiService';

interface ImportFormModalProps {
    onClose: () => void;
    onImport: (form: FormModel) => void;
}

const FormSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
            <span className="bg-zinc-800 text-zinc-400 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border border-zinc-700">
                {number}
            </span>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">
                {title}
            </h3>
        </div>
        <div>
            {children}
        </div>
    </div>
);

export const ImportFormModal: React.FC<ImportFormModalProps> = ({ onClose, onImport }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Se for JSON, processa normalmente por texto
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setJsonInput(content);
            };
            reader.readAsText(file);
            return;
        }

        // Se for PDF ou Excel, usa a IA para extrair
        const supportedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];

        if (supportedTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
            setIsAiProcessing(true);
            try {
                const base64 = await convertFileToBase64(file);
                // MIME types compatíveis com o Gemini para documentos
                let mimeToUse = file.type;
                if (!mimeToUse && file.name.endsWith('.csv')) mimeToUse = 'text/csv';
                if (!mimeToUse && file.name.endsWith('.xlsx')) mimeToUse = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

                const extractedForm = await extractFormFromFile(base64, mimeToUse);
                setJsonInput(JSON.stringify(extractedForm, null, 2));
            } catch (err: any) {
                setError("O cérebro da IA não conseguiu processar este arquivo. Tente um formato mais legível ou use JSON direto.");
                console.error(err);
            } finally {
                setIsAiProcessing(false);
            }
        } else {
            setError("Formato de arquivo não suportado. Use JSON, PDF ou Planilhas (Excel/CSV).");
        }
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsed = JSON.parse(jsonInput);
            
            if (!parsed.name || !Array.isArray(parsed.fields)) {
                throw new Error('O formato resultante é inválido. Certifique-se de que os dados seguem a estrutura de formulário.');
            }

            const importedForm: FormModel = {
                ...parsed,
                id: uuidv4(),
            };

            onImport(importedForm);
        } catch (err: any) {
            setError(err.message || 'Erro ao processar os dados. Verifique a sintaxe.');
        }
    };

    return (
        <div className="fixed inset-0 z-[600] bg-zinc-950 flex flex-col animate-fadeInUp overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full py-16 px-8">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Importar Estrutura</h1>
                        <p className="text-zinc-500 text-xl font-medium">Importe via JSON ou deixe nossa IA ler seus PDFs e Planilhas de formulários.</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-zinc-900 text-zinc-500 hover:text-white rounded-2xl transition-all border border-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                <form onSubmit={handleImport} className="space-y-8">
                    <FormSection number="1" title="Upload de Arquivo (JSON, PDF, Excel)">
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept=".json,.pdf,.xlsx,.xls,.csv" 
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={isAiProcessing}
                            />
                            <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${isAiProcessing ? 'border-primary bg-primary/5 animate-pulse' : 'border-zinc-800 group-hover:border-primary group-hover:bg-primary/5'}`}>
                                {isAiProcessing ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-zinc-900 animate-spin">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                                        </div>
                                        <p className="text-primary font-black text-xl uppercase tracking-widest">IA Extraindo Estrutura...</p>
                                        <p className="text-zinc-500 font-medium mt-2">O Gemini está analisando os campos do seu documento.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors border border-zinc-800">
                                                <span className="font-black text-xs">PDF</span>
                                            </div>
                                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors border border-zinc-800">
                                                <span className="font-black text-xs">XLS</span>
                                            </div>
                                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-sky-500 transition-colors border border-zinc-800">
                                                <span className="font-black text-xs">JSON</span>
                                            </div>
                                        </div>
                                        <p className="text-white font-bold text-lg mb-1">Arraste seu arquivo aqui</p>
                                        <p className="text-zinc-500 font-medium">PDF, Excel, CSV ou JSON suportados</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection number="2" title="Revisão da Estrutura">
                        <textarea 
                            value={jsonInput}
                            onChange={(e) => {
                                setJsonInput(e.target.value);
                                setError(null);
                            }}
                            placeholder='Os dados estruturados aparecerão aqui após o upload...'
                            className="w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-emerald-400 font-mono text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-fadeInUp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <span className="font-bold text-sm uppercase tracking-wider">{error}</span>
                            </div>
                        )}
                    </FormSection>

                    <div className="flex justify-end items-center gap-8 pt-12 border-t border-zinc-900">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="text-zinc-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={!jsonInput.trim() || isAiProcessing}
                            className="group px-12 py-5 bg-primary disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-black rounded-2xl hover:bg-primary-light transition-all transform active:scale-95 shadow-xl shadow-primary/10 flex items-center gap-4 uppercase tracking-widest text-sm"
                        >
                            <span>Confirmar Importação</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
