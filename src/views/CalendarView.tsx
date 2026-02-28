import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, subMonths, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const habits = useStore(s => s.habits);
  const records = useStore(s => s.records);
  const notes = useStore(s => s.notes);
  const setNote = useStore(s => s.setNote);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getDayStats = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (habits.length === 0) return 0;
    
    const completedCount = records.filter(r => r.date === dateStr && r.completed).length;
    return Math.round((completedCount / habits.length) * 100);
  };

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedNote = notes.find(n => n.date === selectedDateStr)?.text || '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Takvim</h1>
      </div>

      <div className="glass-panel rounded-3xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold capitalize text-content">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-glass-hover rounded-full transition-colors text-content">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-glass-hover rounded-full transition-colors text-content">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {days.map(day => {
            const percent = getDayStats(day);
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden transition-colors ${
                  isSelected ? 'bg-glass-active border border-glass-border' : 'bg-input hover:bg-glass-hover'
                }`}
              >
                {percent > 0 && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/30 transition-all duration-500"
                    style={{ height: `${percent}%` }}
                  />
                )}
                <span className={`relative z-10 text-sm ${isToday(day) ? 'font-bold text-emerald-500' : 'text-content'}`}>
                  {format(day, 'd')}
                </span>
                {notes.find(n => n.date === format(day, 'yyyy-MM-dd'))?.text && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-panel rounded-3xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-content">
                {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-glass-hover rounded-full text-content">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">Tamamlanma</span>
                  <span className="font-medium text-content">{getDayStats(selectedDate)}%</span>
                </div>
                <div className="h-2 bg-input rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getDayStats(selectedDate)}%` }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Günlük Not</label>
                <textarea
                  value={selectedNote}
                  onChange={(e) => setNote(selectedDateStr, e.target.value)}
                  placeholder="Bugün nasıl geçti? Notlarını buraya yaz..."
                  className="w-full bg-input border border-input-border rounded-xl p-3 text-sm text-content placeholder-muted focus:outline-none focus:ring-2 focus:ring-glass-border min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted">O Günün Alışkanlıkları</h4>
                {habits.map(habit => {
                  const isCompleted = records.find(r => r.habitId === habit.id && r.date === selectedDateStr)?.completed;
                  return (
                    <div key={habit.id} className="flex items-center gap-3 bg-input p-2 rounded-lg">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${habit.color}40` }}>
                        {habit.emoji}
                      </div>
                      <span className="flex-1 text-sm text-content">{habit.name}</span>
                      <div className={`w-4 h-4 rounded-full border ${isCompleted ? 'bg-emerald-400 border-emerald-400' : 'border-glass-border'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
