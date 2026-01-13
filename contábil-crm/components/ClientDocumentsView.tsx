

import React, { useState } from 'react';
import { Document, DocumentCategory } from '../types';

interface ClientDocumentsViewProps {
    documents: Document[];
    clientId: string;
    onAddDocument: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
}

const UploadModal: React.FC<{
    onClose: () => void;
    clientId: string;
    onAddDocument: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
}> = ({ onClose, clientId, onAddDocument }) => {
    const [name, setName] = useState('');
    // FIX: Property 'Others' does not exist on type 'typeof DocumentCategory'. Corrected to 'Outros'.
    const [category, setCategory] = useState<DocumentCategory>(DocumentCategory.Outros);
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fileSize = `${(Math.random() * 5).toFixed(1)} MB`;
        onAddDocument({
            clientId,
            name: `${name}.pdf`, // Simulate PDF upload
            category,
            fileSize,
            isPublic
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Upload de Documento</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-4 mb-6">Esta é uma simulação. Nenhum arquivo real será enviado.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome do Documento (sem extensão)</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Categoria</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as DocumentCategory)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required>
                            {Object.values(DocumentCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 rounded border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-primary focus:ring-primary" />
                        <label htmlFor="isPublic" className="text-sm text-zinc-600 dark:text-zinc-300">Visível para o cliente no portal</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary-light">Salvar Documento</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ documents, clientId, onAddDocument }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // FIX: Explicitly type the accumulator in the reduce function to prevent potential type errors.
    const groupedDocuments = documents.reduce((acc: Record<string, Document[]>, doc) => {
        (acc[doc.category] = acc[doc.category] || []).push(doc);
        return acc;
    }, {});

    const categories = Object.values(DocumentCategory);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-primary-light transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    Upload Documento
                </button>
            </div>
            {documents.length > 0 ? (
                categories.map(category => {
                    const docsInCategory = groupedDocuments[category];
                    if (!docsInCategory || docsInCategory.length === 0) return null;

                    return (
                        <div key={category}>
                            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">{category}</h4>
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                {docsInCategory.map(doc => (
                                     <div key={doc.id} className="p-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700/50 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                            <div>
                                                <p className="font-medium text-black dark:text-white">{doc.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Upload em {doc.uploadDate.toLocaleDateString('pt-BR')} - {doc.fileSize}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {doc.isPublic && <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Público</span>}
                                            <button className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white">...</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })
            ) : (
                 <div className="text-center text-zinc-500 dark:text-zinc-400 py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                    <h3 className="mt-2 text-lg font-medium text-black dark:text-white">Nenhum documento</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Faça o upload do primeiro documento deste cliente.</p>
                </div>
            )}
            {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} clientId={clientId} onAddDocument={onAddDocument}/>}
        </div>
    );
};