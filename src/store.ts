import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from './types';

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: [],
      records: [],
      notes: [],
      theme: 'dark',
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]
      })),
      updateHabit: (id, updated) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, ...updated } : h)
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id),
        records: state.records.filter(r => r.habitId !== id)
      })),
      toggleRecord: (habitId, date) => set((state) => {
        const existing = state.records.find(r => r.habitId === habitId && r.date === date);
        if (existing) {
          return {
            records: state.records.map(r => r.habitId === habitId && r.date === date ? { ...r, completed: !r.completed } : r)
          };
        } else {
          return {
            records: [...state.records, { habitId, date, completed: true }]
          };
        }
      }),
      setNote: (date, text) => set((state) => {
        const existing = state.notes.find(n => n.date === date);
        if (existing) {
          return {
            notes: state.notes.map(n => n.date === date ? { ...n, text } : n)
          };
        } else {
          return {
            notes: [...state.notes, { date, text }]
          };
        }
      }),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'habit-tracker-storage',
    }
  )
);
