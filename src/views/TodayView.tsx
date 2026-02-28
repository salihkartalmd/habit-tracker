import { useStore } from '../store';
import { getTodayStr } from '../utils/date';
import { motion } from 'motion/react';
import { Check, Flame } from 'lucide-react';

export default function TodayView() {
  const habits = useStore(s => s.habits);
  const records = useStore(s => s.records);
  const toggleRecord = useStore(s => s.toggleRecord);
  const today = getTodayStr();

  const getStreak = (habitId: string) => {
    let streak = 0;
    let currentDate = new Date();
    
    const completedToday = records.find(r => r.habitId === habitId && r.date === getTodayStr())?.completed;
    
    if (!completedToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const record = records.find(r => r.habitId === habitId && r.date === dateStr);
      
      if (record && record.completed) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bugün</h1>
        <p className="text-muted mt-1">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-muted glass-panel rounded-3xl">
            Takip edilecek alışkanlık yok.<br/>Alışkanlıklar sekmesinden ekleyebilirsin.
          </div>
        ) : (
          habits.map((habit, i) => {
            const isCompleted = records.find(r => r.habitId === habit.id && r.date === today)?.completed || false;
            const streak = getStreak(habit.id);

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={habit.id}
                onClick={() => toggleRecord(habit.id, today)}
                className={`glass-panel rounded-3xl p-5 cursor-pointer transition-all duration-500 relative overflow-hidden group ${
                  isCompleted ? 'shadow-lg' : 'hover:bg-glass-hover'
                }`}
                style={{
                  backgroundColor: isCompleted ? `${habit.color}15` : undefined,
                  borderColor: isCompleted ? `${habit.color}40` : undefined,
                }}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${
                      isCompleted ? 'scale-110 shadow-md' : 'opacity-80 grayscale-[0.2]'
                    }`}
                    style={{ backgroundColor: isCompleted ? habit.color : `${habit.color}40` }}
                  >
                    <span className={`transition-transform duration-500 ${isCompleted ? 'scale-110' : 'scale-100'}`}>
                      {habit.emoji}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${isCompleted ? 'text-content' : 'text-muted'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-sm font-medium flex items-center gap-1.5 transition-colors duration-300 ${isCompleted ? 'text-content/80' : 'text-muted/70'}`}>
                        <Flame size={16} className={streak > 0 ? (isCompleted ? 'text-orange-500' : 'text-orange-500/60') : 'text-muted/40'} />
                        {streak} gün
                      </span>
                    </div>
                  </div>

                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? 'scale-110 shadow-sm' 
                        : 'border-glass-border text-transparent group-hover:border-content/30'
                    }`}
                    style={isCompleted ? {
                      backgroundColor: habit.color,
                      borderColor: habit.color,
                      color: 'rgba(0,0,0,0.7)'
                    } : {}}
                  >
                    <Check size={18} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
