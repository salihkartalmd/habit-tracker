import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckSquare, ListTodo, Settings } from 'lucide-react';
import TodayView from './views/TodayView';
import CalendarView from './views/CalendarView';
import HabitsView from './views/HabitsView';
import SettingsView from './views/SettingsView';
import { useStore } from './store';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'habits' | 'settings'>('today');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 px-4 max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeTab === 'today' && <TodayView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'settings' && <SettingsView deferredPrompt={deferredPrompt} setDeferredPrompt={setDeferredPrompt} />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Blur Gradient */}
      <div className="bottom-blur-gradient" />

      {/* Bottom Nav */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
        <nav className="glass-pill flex items-center p-1.5 gap-1 w-full max-w-sm justify-between shadow-2xl">
          <NavItem 
            icon={<CheckSquare size={22} />} 
            label="Bugün" 
            isActive={activeTab === 'today'} 
            onClick={() => setActiveTab('today')} 
          />
          <NavItem 
            icon={<Calendar size={22} />} 
            label="Takvim" 
            isActive={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
          />
          <NavItem 
            icon={<ListTodo size={22} />} 
            label="Alışkanlıklar" 
            isActive={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')} 
          />
          <NavItem 
            icon={<Settings size={22} />} 
            label="Ayarlar" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 px-3 py-3.5 rounded-full transition-colors duration-300 flex-1 ${
        isActive ? 'text-content' : 'text-muted hover:text-content hover:bg-glass-hover'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-pill-active rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      {isActive && (
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          className="relative z-10 text-sm font-semibold overflow-hidden whitespace-nowrap hidden sm:block"
        >
          {label}
        </motion.span>
      )}
    </button>
  );
}
