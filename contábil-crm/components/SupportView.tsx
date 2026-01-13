
import React, { useState, useEffect } from 'react';
import { Client, Ticket, TicketStatus } from '../types';

interface SupportViewProps {
  clients: Client[];
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'reportedDate' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (ticketId: string) => void;
  onSelectClient: (clientId: string) => void;
}

const TicketModal: React.FC<{
    onClose: () => void;
    clients: Client[];
    onSave: (ticket: Omit<Ticket, 'id' | 'reportedDate' | 'status'> | Ticket) => void;
    ticketToEdit: Ticket | null;
}> = ({ onClose, clients, onSave, ticketToEdit }) => {
    const isEditing = ticketToEdit !== null;
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState<TicketStatus>(TicketStatus.Open);
    const [reportedDate, setReportedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isEditing && ticketToEdit) {
            setTitle(ticketToEdit.title);
            setClientId(ticketToEdit.clientId);
            setStatus(ticketToEdit.status);
            setReportedDate(new Date(ticketToEdit.reportedDate).toISOString().split('T')[0]);
        }
    }, [isEditing, ticketToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!clientId) return;

        const dateParts = reportedDate.split('-').map(part => parseInt(part, 10));
        const adjustedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        const ticketData = {
            title,
            clientId,
            status,
            reportedDate: adjustedDate
        };

        if (isEditing && ticketToEdit) {
            onSave({ ...ticketData, id: ticketToEdit.id });
        } else {
            onSave({ title, clientId }); // New tickets default status/date in App.tsx logic usually, but here we can pass if needed. App logic overrides for add.
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{isEditing ? 'Editar Ocorrência' : 'Registrar Nova Ocorrência'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Cliente</label>
                        <select id="clientId" value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required>
                             <option value="" disabled>Selecione um cliente</option>
                             {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Título da Ocorrência</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                    </div>
                    {isEditing && (
                        <>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Status</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as TicketStatus)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold">
                                    {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="reportedDate" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300">Data de Abertura</label>
                                <input type="date" id="reportedDate" value={reportedDate} onChange={e => setReportedDate(e.target.value)} className="mt-1 block w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-black dark:text-white focus:outline-none focus:ring-gold focus:border-gold" required />
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gold text-black font-bold rounded-md hover:bg-gold-light">{isEditing ? 'Salvar Alterações' : 'Salvar Ocorrência'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const SupportView: React.FC<SupportViewProps> = ({ clients, tickets, addTicket, updateTicketStatus, updateTicket, deleteTicket, onSelectClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');

  const getClientNameById = (id: string) => clients.find(c => c.id === id)?.companyName || 'N/A';

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  const statusStyles: Record<TicketStatus, string> = {
      [TicketStatus.Open]: 'bg-yellow-500',
      [TicketStatus.Closed]: 'bg-green-500',
  };

  const handleOpenAdd = () => {
      setEditingTicket(null);
      setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket: Ticket) => {
      setEditingTicket(ticket);
      setIsModalOpen(true);
  };

  const handleSave = (ticketData: Ticket | Omit<Ticket, 'id' | 'reportedDate' | 'status'>) => {
      if ('id' in ticketData) {
          updateTicket(ticketData);
      } else {
          addTicket(ticketData);
      }
      setIsModalOpen(false);
  };

  const handleDelete = (ticketId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este ticket?")) {
          deleteTicket(ticketId);
      }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">Tickets de Suporte</h3>
             <div className="flex gap-2 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-gold text-black font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>Todos</button>
                <button onClick={() => setFilter(TicketStatus.Open)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === TicketStatus.Open ? 'bg-gold text-black font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>Abertos</button>
                <button onClick={() => setFilter(TicketStatus.Closed)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === TicketStatus.Closed ? 'bg-gold text-black font-semibold' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>Fechados</button>
            </div>
        </div>
        <button onClick={handleOpenAdd} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
            Nova Ocorrência
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Ocorrência</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Cliente</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Data</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
              <th className="p-4 font-semibold text-zinc-600 dark:text-zinc-400">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="group hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors duration-150">
                <td className="p-4 text-black dark:text-white">{ticket.title}</td>
                <td className="p-4 text-zinc-600 dark:text-zinc-400">
                   <button onClick={() => onSelectClient(ticket.clientId)} className="hover:underline text-left">
                        {getClientNameById(ticket.clientId)}
                    </button>
                </td>
                <td className="p-4 text-zinc-600 dark:text-zinc-400">{new Date(ticket.reportedDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full text-black ${statusStyles[ticket.status]}`}>
                        {ticket.status}
                    </span>
                </td>
                <td className="p-4">
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenEdit(ticket)} className="p-2 text-zinc-500 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        {ticket.status === TicketStatus.Open && (
                             <button onClick={() => updateTicketStatus(ticket.id, TicketStatus.Closed)} className="p-2 text-zinc-500 hover:text-green-600 bg-zinc-100 dark:bg-zinc-800 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="Marcar como Fechado">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                             </button>
                        )}
                        <button onClick={() => handleDelete(ticket.id)} className="p-2 text-zinc-500 hover:text-red-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Excluir">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <TicketModal onClose={() => setIsModalOpen(false)} clients={clients} onSave={handleSave} ticketToEdit={editingTicket} />}
    </div>
  );
};
