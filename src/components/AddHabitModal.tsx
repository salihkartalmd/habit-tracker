import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { HabitType, HabitFrequency } from '../types';

const PASTEL_COLORS = [
  '#FFB3BA', // Pastel Red
  '#FFDFBA', // Pastel Orange
  '#FFFFBA', // Pastel Yellow
  '#BAFFC9', // Pastel Green
  '#BAE1FF', // Pastel Blue
  '#D0BAFF', // Pastel Purple
  '#FFB3F7', // Pastel Pink
  '#E2F0CB', // Pastel Lime
];

export default function AddHabitModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const addHabit = useStore(s => s.addHabit);
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('build');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [emoji, setEmoji] = useState('💧');
  const [color, setColor] = useState(PASTEL_COLORS[4]);
  const [penalty, setPenalty] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({ name, type, frequency, emoji, color, penalty });
    setName('');
    setPenalty('');
    setFrequency('daily');
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-main rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-glass-border"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-glass-border bg-main z-10">
              <h2 className="text-xl font-bold text-content">Yeni Alışkanlık</h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-input hover:bg-glass-hover text-content transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-5 pb-10 sm:pb-5 overscroll-contain">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">Alışkanlık Adı</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-input border border-input-border rounded-xl px-4 py-4 text-content placeholder-muted focus:outline-none focus:ring-2 focus:ring-content transition-all text-base"
                    placeholder="Örn: Su İçmek"
                    required
                  />
                </div>

                {/* Type */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('build')}
                    className={`py-4 px-2 rounded-xl border-2 transition-all text-sm font-bold ${
                      type === 'build' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-input border-transparent text-muted hover:bg-glass-hover'
                    }`}
                  >
                    Edinmek İstiyorum
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('break')}
                    className={`py-4 px-2 rounded-xl border-2 transition-all text-sm font-bold ${
                      type === 'break' 
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' 
                        : 'bg-input border-transparent text-muted hover:bg-glass-hover'
                    }`}
                  >
                    Bırakmak İstiyorum
                  </button>
                </div>

                {/* Emoji & Frequency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-muted mb-2">Emoji</label>
                    <input
                      type="text"
                      value={emoji}
                      onChange={e => setEmoji(e.target.value)}
                      className="w-full bg-input border border-input-border rounded-xl px-4 py-4 text-content text-center text-3xl focus:outline-none focus:ring-2 focus:ring-content transition-all"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted mb-2">Sıklık</label>
                    <select
                      value={frequency}
                      onChange={e => setFrequency(e.target.value as HabitFrequency)}
                      className="w-full bg-input border border-input-border rounded-xl px-4 py-4 text-content focus:outline-none focus:ring-2 focus:ring-content transition-all appearance-none text-base h-[68px]"
                    >
                      <option value="daily" className="bg-main text-content">Her Gün</option>
                      <option value="weekdays" className="bg-main text-content">Hafta İçi</option>
                      <option value="weekends" className="bg-main text-content">Hafta Sonu</option>
                      <option value="weekly" className="bg-main text-content">Haftada Bir</option>
                    </select>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">Renk</label>
                  <div className="bg-input border border-input-border rounded-xl p-4 grid grid-cols-4 gap-4 place-items-center">
                    {PASTEL_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-12 h-12 rounded-full transition-all ${
                          color === c 
                            ? 'scale-110 ring-4 ring-content ring-offset-2 ring-offset-main shadow-lg' 
                            : 'hover:scale-105 opacity-80'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Penalty */}
                <div>
                  <label className="block text-sm font-semibold text-muted mb-2">Ceza (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    value={penalty}
                    onChange={e => setPenalty(e.target.value)}
                    className="w-full bg-input border border-input-border rounded-xl px-4 py-4 text-content placeholder-muted focus:outline-none focus:ring-2 focus:ring-content transition-all text-base"
                    placeholder="Örn: 50 TL bağış yap"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-invert text-invert-content font-bold py-4 rounded-xl mt-4 hover:opacity-90 transition-opacity text-lg shadow-xl"
                >
                  Alışkanlığı Oluştur
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
