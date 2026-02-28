import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store';

export default function SettingsView() {
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>

      <div className="glass-panel rounded-3xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Tema</h3>
            <p className="text-sm text-muted">Uygulama görünümünü seçin</p>
          </div>
          <div className="flex bg-input rounded-full p-1 border border-input-border">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                theme === 'light' ? 'bg-invert text-invert-content shadow-md' : 'text-muted hover:text-content'
              }`}
            >
              <Sun size={18} />
              <span className="text-sm font-medium">Aydınlık</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                theme === 'dark' ? 'bg-invert text-invert-content shadow-md' : 'text-muted hover:text-content'
              }`}
            >
              <Moon size={18} />
              <span className="text-sm font-medium">Karanlık</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
