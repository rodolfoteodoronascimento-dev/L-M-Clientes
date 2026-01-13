import React, { useState, useMemo } from 'react';
import { Task, Client, TaskStatus, CalendarEvent, CalendarItem } from '../types';
import { EventModal } from './EventModal';

interface CalendarViewProps {
  tasks: Task[];
  clients: Client[];
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (eventId: string) => void;
  updateTask: (task: Task) => void;
}

type ViewMode = 'month' | 'week' | 'day';

// Helper functions for date manipulation
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const startOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday is 0, so this works as a baseline
    d.setHours(0,0,0,0);
    return d;
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: 'bg-slate-200 text-slate-800 border-slate-400 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-500',
  [TaskStatus.InProgress]: 'bg-blue-200 text-blue-800 border-blue-400 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-600',
  [TaskStatus.Done]: 'bg-green-200 text-green-800 border-green-400 dark:bg-green-900/50 dark:text-green-200 dark:border-green-600',
};

const eventColorClasses: Record<string, string> = {
    blue: 'bg-sky-100 text-sky-800 border-sky-500 dark:bg-sky-900/50 dark:text-sky-200 dark:border-sky-600',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-500 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-600',
    red: 'bg-red-100 text-red-800 border-red-500 dark:bg-red-900/50 dark:text-red-200 dark:border-red-600',
    yellow: 'bg-amber-100 text-amber-800 border-amber-500 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-600',
    purple: 'bg-purple-100 text-purple-800 border-purple-500 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-600',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, clients, calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, updateTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.companyName || 'N/A';
  
  const allItems: CalendarItem[] = useMemo(() => [
    ...tasks.map(t => ({ ...t, type: 'task' as const })),
    ...calendarEvents.map(e => ({...e, type: 'event' as const}))
  ], [tasks, calendarEvents]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    allItems.forEach(item => {
      const dateKey = (item.type === 'task' ? new Date(item.dueDate) : new Date(item.start)).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(item);
    });
    return map;
  }, [allItems]);

  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const openModalForNew = (date: Date) => {
    setSelectedDate(date);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (item: CalendarItem) => {
    setSelectedDate(null);
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: CalendarItem) => {
    setDraggedItemId(item.id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
      e.preventDefault();
      if (!draggedItemId) return;

      const item = allItems.find(i => i.id === draggedItemId);
      if (!item) return;

      if (item.type === 'task') {
          updateTask({ ...item, dueDate: date });
      } else {
          const duration = item.end.getTime() - item.start.getTime();
          const newStart = new Date(date);
          const newEnd = new Date(newStart.getTime() + duration);
          updateCalendarEvent({ ...item, start: newStart, end: newEnd });
      }
      setDraggedItemId(null);
  };


  const renderHeader = () => {
    let title = '';
    if (viewMode === 'week') {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = addDays(weekStart, 6);
        title = `${weekStart.toLocaleDateString('pt-BR', {month: 'short', day: 'numeric'})} - ${weekEnd.toLocaleDateString('pt-BR', {month: 'short', day: 'numeric', year: 'numeric'})}`
    } else if (viewMode === 'day') {
        title = currentDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else {
        title = currentDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    }

    return (
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Calendário</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg text-black dark:text-white">
                    <button onClick={handlePrev} className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/50" aria-label="Período anterior"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
                    <button onClick={handleToday} className="px-4 py-1.5 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700/50">Hoje</button>
                    <button onClick={handleNext} className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/50" aria-label="Próximo período"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></button>
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white w-64 text-center">{title}</h2>
            </div>
             <div className="flex items-center gap-4">
                <div className="flex gap-2 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800">
                    {(['month', 'week', 'day'] as ViewMode[]).map(view => <button key={view} onClick={() => setViewMode(view)} className={`px-3 py-1 text-sm font-semibold rounded-md capitalize transition-colors ${viewMode === view ? 'bg-white dark:bg-gold text-black' : 'text-zinc-500 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/50'}`}>{view === 'month' ? 'Mês' : view === 'week' ? 'Semana' : 'Dia'}</button>)}
                </div>
                <button onClick={() => openModalForNew(new Date())} className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Adicionar Evento
                </button>
            </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const cells = Array.from({ length: firstDayIndex }, (_, i) => <div key={`empty-start-${i}`} className="border-t border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30" onClick={() => openModalForNew(new Date(year, month, i - firstDayIndex + 1))}></div>);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = date.toDateString();
        const dayItems = itemsByDate.get(dateKey) || [];
        const isToday = date.toDateString() === new Date().toDateString();
        cells.push(
            <div key={dateKey} className="border-t border-r border-zinc-200 dark:border-zinc-800 p-2 min-h-[120px] flex flex-col relative group cursor-pointer" onClick={() => openModalForNew(date)}>
                <span className={`font-semibold text-sm self-start ${isToday ? 'bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center' : 'text-zinc-600 dark:text-zinc-300'}`}>{day}</span>
                <div className="mt-1 space-y-1 overflow-y-auto flex-1">
                    {dayItems.map(item => <CalendarItemPill key={item.id} item={item} getClientName={getClientName} onEdit={openModalForEdit}/>)}
                </div>
                 <button onClick={(e) => { e.stopPropagation(); openModalForNew(date); }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 text-black rounded-full w-5 h-5 flex items-center justify-center">+</button>
            </div>
        );
    }
    
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-7 text-center font-bold p-2 text-zinc-500 dark:text-zinc-400 text-sm">{weekDays.map(wd => <div key={wd}>{wd}</div>)}</div>
        <div className="grid grid-cols-7 grid-flow-row auto-rows-fr">{cells}</div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg grid grid-cols-7 divide-x divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800">
          {weekDays.map((date, index) => {
              const dateKey = date.toDateString();
              const dayItems = itemsByDate.get(dateKey) || [];
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                  <div key={dateKey} className="p-2 min-h-[60vh] " onDrop={(e) => handleDrop(e, date)} onDragOver={(e) => e.preventDefault()}>
                       <div className="text-center mb-4 cursor-pointer" onClick={() => openModalForNew(date)}>
                          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{weekDayNames[index]}</p>
                          <span className={`text-2xl font-bold mt-1 ${isToday ? 'bg-primary text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-black dark:text-zinc-200'}`}>{date.getDate()}</span>
                      </div>
                      <div className="space-y-2">
                          {dayItems.map(item => <CalendarItemPill key={item.id} item={item} getClientName={getClientName} onEdit={openModalForEdit} onDragStart={handleDragStart} isDraggable/>)}
                      </div>
                  </div>
              );
          })}
      </div>
    );
  };
  
  const renderDayView = () => {
    const dateKey = currentDate.toDateString();
    const dayItems = [...(itemsByDate.get(dateKey) || [])].sort((a,b) => (a.type === 'task' ? a.dueDate.getTime() : a.start.getTime()) - (b.type === 'task' ? b.dueDate.getTime() : b.start.getTime()));
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
            {dayItems.length > 0 ? (
                <div className="space-y-3">
                    {dayItems.map(item => {
                         const isTask = item.type === 'task';
                         const colors = isTask ? statusColors[item.status] : (eventColorClasses[item.color] || eventColorClasses.blue);
                         const taskStatusText = isTask ? statusColors[item.status] : '';
                         return (
                             <div key={item.id} onClick={() => openModalForEdit(item)} className={`p-4 rounded-lg flex justify-between items-center border-l-4 cursor-pointer ${colors}`}>
                               <div>
                                 <p className="text-lg font-semibold">{item.title}</p>
                                 {item.type === 'task' && <p className="text-sm text-zinc-500 dark:text-zinc-400">{getClientName(item.clientId)}</p>}
                                 {item.type === 'event' && item.description && <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>}
                               </div>
                               {item.type === 'task' && <span className={`px-3 py-1 text-sm font-semibold rounded-full ${taskStatusText}`}>{item.status}</span>}
                             </div>
                         );
                    })}
                </div>
            ) : (
                <div className="text-center text-zinc-500 dark:text-zinc-400 py-16 cursor-pointer" onClick={() => openModalForNew(currentDate)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <h3 className="mt-2 text-lg font-medium text-black dark:text-white">Nenhum evento agendado</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Clique aqui para adicionar um novo evento.</p>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderHeader()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
       <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            // FIX: The item from the modal is always a CalendarEvent-like object.
            // We cast it and check for the 'id' to differentiate between adding and updating.
            // This resolves type errors related to Omit<CalendarEvent, 'id'>.
            onSave={(item) => {
                const event = item as CalendarEvent;
                if (event.id) {
                    updateCalendarEvent(event);
                } else {
                    // For new events, we must strip the potentially undefined 'id' property.
                    const { id, ...newEvent } = event;
                    addCalendarEvent(newEvent);
                }
            }}
            onDelete={deleteCalendarEvent}
            item={selectedItem}
            selectedDate={selectedDate}
        />
    </div>
  );
};


const CalendarItemPill: React.FC<{
    item: CalendarItem;
    getClientName: (id: string) => string;
    onEdit: (item: CalendarItem) => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, item: CalendarItem) => void;
    isDraggable?: boolean;
}> = ({ item, getClientName, onEdit, onDragStart, isDraggable }) => {
    const isTask = item.type === 'task';
    const colorClasses = isTask ? statusColors[item.status] : (eventColorClasses[item.color] || eventColorClasses.blue);

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            draggable={isDraggable}
            onDragStart={isDraggable && onDragStart ? (e) => onDragStart(e, item) : undefined}
            className={`p-1.5 rounded text-xs border-l-4 cursor-pointer ${colorClasses} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
            title={`${item.title} ${isTask ? `- ${getClientName(item.clientId)}` : ''}`}
        >
            <p className="font-semibold truncate">
                {!isTask && "• "}
                {item.title}
            </p>
        </div>
    );
};