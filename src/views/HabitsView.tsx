import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import AddHabitModal from '../components/AddHabitModal';
import { motion } from 'motion/react';

export default function HabitsView() {
  const habits = useStore(s => s.habits);
  const deleteHabit = useStore(s => s.deleteHabit);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Alışkanlıklarım</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="p-3 bg-glass hover:bg-glass-hover rounded-full backdrop-blur-md border border-glass-border transition-colors text-content"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-muted">
            Henüz hiç alışkanlık eklemedin.
          </div>
        ) : (
          habits.map((habit, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={habit.id}
              className="glass-panel rounded-2xl p-4 flex items-center justify-between"
              style={{ borderLeft: `4px solid ${habit.color}` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${habit.color}40` }}>
                  {habit.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-content">{habit.name}</h3>
                  <p className="text-sm text-muted">
                    {habit.type === 'build' ? 'Edinilecek' : 'Bırakılacak'}
                    {habit.penalty && ` • Ceza: ${habit.penalty}`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="p-2 text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
