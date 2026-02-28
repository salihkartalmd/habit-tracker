export type HabitType = 'build' | 'break';
export type HabitFrequency = 'daily' | 'weekly' | 'weekdays' | 'weekends';
export type Theme = 'light' | 'dark';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  frequency: HabitFrequency;
  emoji: string;
  color: string;
  penalty: string;
  createdAt: string;
}

export interface HabitRecord {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface DayNote {
  date: string;
  text: string;
}

export interface AppState {
  habits: Habit[];
  records: HabitRecord[];
  notes: DayNote[];
  theme: Theme;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleRecord: (habitId: string, date: string) => void;
  setNote: (date: string, text: string) => void;
  setTheme: (theme: Theme) => void;
}
