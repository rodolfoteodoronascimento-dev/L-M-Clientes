
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'> | User) => void;
    userToEdit: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const isEditing = userToEdit !== null;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Analyst);
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (isEditing && userToEdit) {
                setName(userToEdit.name);
                setEmail(userToEdit.email);
                setRole(userToEdit.role);
                setAvatar(userToEdit.avatar || '');
            } else {
                setName('');
                setEmail('');
                setRole(UserRole.Analyst);
                setAvatar(`https://i.pravatar.cc/40?u=${Math.random()}`);
            }
        }
    }, [isOpen, userToEdit, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { name, email, role, avatar, isActive: true };
        if (isEditing && userToEdit) {
            onSave({ ...userData, id: userToEdit.id, isActive: userToEdit.isActive });
        } else {
            onSave(userData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="relative group">
                            <img 
                                src={avatar || `https://ui-avatars.com/api/?name=${name || 'User'}`} 
                                alt="Avatar Preview" 
                                className="w-24 h-24 rounded-full border-4 border-primary/20 object-cover shadow-lg"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name || 'User'}`;
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="avatar" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Link da Foto (URL)</label>
                            <input 
                                type="text" 
                                id="avatar" 
                                value={avatar} 
                                onChange={e => setAvatar(e.target.value)} 
                                className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-gold focus:border-gold text-xs" 
                                placeholder="https://exemplo.com/foto.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Nome Completo</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-gold focus:border-gold" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">E-mail</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-gold focus:border-gold" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Função / Permissão</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 text-black dark:text-white focus:ring-gold focus:border-gold">
                            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    
                    {!isEditing && (
                        <div>
                             <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Senha Provisória</label>
                             <input type="text" value="Mudar123" disabled className="mt-1 block w-full bg-zinc-200 dark:bg-zinc-700 border-transparent rounded-md py-2 px-3 text-zinc-500 dark:text-zinc-400 cursor-not-allowed" />
                             <p className="text-xs text-zinc-500 mt-1">O usuário deverá alterar a senha no primeiro acesso.</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-zinc-900 font-bold rounded-md hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20">
                            {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
