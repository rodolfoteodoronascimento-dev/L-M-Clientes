
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserModal } from './modals/UserModal';

interface UsersViewProps {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
}

const roleColors: Record<UserRole, string> = {
    [UserRole.Admin]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    [UserRole.Manager]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    [UserRole.Analyst]: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
};

export const UsersView: React.FC<UsersViewProps> = ({ users, addUser, updateUser, deleteUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleOpenAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSave = (userData: User | Omit<User, 'id'>) => {
        if ('id' in userData) {
            updateUser(userData);
        } else {
            addUser(userData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (userId: string) => {
        if (window.confirm("Tem certeza que deseja desativar este usuário?")) {
            deleteUser(userId);
        }
    }

    return (
        <div className="space-y-6 animate-fadeInUp">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white">Gestão de Usuários</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gerencie o acesso e as permissões da equipe.</p>
                </div>
                <button onClick={handleOpenAdd} className="bg-gradient-to-r from-primary to-primary-dark text-zinc-900 font-bold px-4 py-2 rounded-lg hover:from-primary-light hover:to-primary transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Novo Usuário
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Usuário</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Função</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                            <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {users.map(user => (
                            <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold text-black dark:text-white">{user.name}</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEdit(user)} className="p-2 text-zinc-500 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors" title="Editar">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-zinc-500 hover:text-red-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Desativar/Excluir">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} userToEdit={editingUser} />}
        </div>
    );
};