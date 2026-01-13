import React, { useState, useEffect } from 'react';
import { EmailTemplate } from '../../types';

interface EmailTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: Omit<EmailTemplate, 'id'> | EmailTemplate) => void;
    templateToEdit: EmailTemplate | null;
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const isEditing = templateToEdit !== null;
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (isEditing && templateToEdit) {
                setName(templateToEdit.name);
                setSubject(templateToEdit.subject);
                setBody(templateToEdit.body);
            } else {
                setName('');
                setSubject('');
                setBody('');
            }
        }
    }, [isOpen, templateToEdit, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const templateData = { name, subject, body };
        if (isEditing && templateToEdit) {
            onSave({ ...templateData, id: templateToEdit.id });
        } else {
            onSave(templateData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{isEditing ? 'Editar' : 'Novo'} Modelo de E-mail</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome do Modelo</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white" required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Assunto</label>
                        <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white" required />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Corpo do E-mail</label>
                        <textarea id="body" value={body} onChange={e => setBody(e.target.value)} rows={8} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white" required />
                         <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Use {'{CLIENTE_NOME}'} para o nome do responsável e {'{NOME_EMPRESA}'} para a razão social.</p>
                    </div>
                     <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary-light">Salvar Modelo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};