import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PhillipstonGovernanceOS from "./components/PhillipstonGovernanceOS";
import PublicPortal from "./components/PublicPortal";
import { Building2, ShieldCheck, Sparkles, Zap, X } from 'lucide-react';
import { Toaster } from 'sonner';

type ViewMode = 'public' | 'staff';

const TRANSITION_MS = 280;

export default function App() {
  const [view, setView] = useState<ViewMode>('staff');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return typeof window !== 'undefined' && !localStorage.getItem('phillipston-welcome-dismissed');
  });

  // Persist dismissal
  useEffect(() => {
    if (!showWelcome) {
      localStorage.setItem('phillipston-welcome-dismissed', 'true');
    }
  }, [showWelcome]);

  // Auto-dismiss welcome banner after 8 seconds
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  // Smooth view switching
  const handleViewChange = useCallback((newView: ViewMode) => {
    if (newView === view || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  }, [view, isTransitioning]);

  // Keyboard shortcuts: Alt + P / Alt + S
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (timeout) return;

      if (e.altKey) {
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          handleViewChange('public');
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleViewChange('staff');
        }
        timeout = setTimeout(() => { timeout = null; }, 400);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleViewChange]);

  const views = useMemo(() => [
    {
      id: 'public' as const,
      label: 'Resident Portal',
      icon: Building2,
      shortcut: 'Alt+P',
      bg: 'bg-gradient-to-br from-slate-800 to-slate-700',
      hover: 'hover:from-slate-700 hover:to-slate-600',
      active: 'bg-gradient-to-br from-slate-700 to-slate-600 shadow-slate-900/40',
      text: 'text-white'
    },
    {
      id: 'staff' as const,
      label: 'Staff Dashboard',
      icon: ShieldCheck,
      shortcut: 'Alt+S',
      bg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
      hover: 'hover:from-emerald-500 hover:to-teal-500',
      active: 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-900/30',
      text: 'text-white'
    }
  ], []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Welcome banner */}
      {showWelcome && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="bg-white/95 backdrop-blur-lg px-7 py-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-4 text-slate-800 text-sm font-medium">
            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Phillipston Governance OS — Archive-first public records with M.G.L. c.66 compliance</span>
            <button
              onClick={() => setShowWelcome(false)}
              className="ml-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Dismiss welcome message"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}

      {/* View switcher (floating bottom-right) */}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end gap-4">
        {/* Mode pills */}
        <div className="bg-white/90 backdrop-blur-xl p-2.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center gap-1.5 ring-1 ring-black/5">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => handleViewChange(v.id)}
              className={`
                relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold
                transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400
                ${view === v.id
                  ? `${v.active} ${v.text} scale-105 shadow-lg`
                  : `text-slate-600 hover:bg-slate-50/80 hover:text-slate-900`
                }
              `}
              title={`Switch to ${v.label} (${v.shortcut})`}
              aria-label={`Switch to ${v.label}`}
              aria-selected={view === v.id}
            >
              <v.icon className="w-4.5 h-4.5" />
              <span>{v.label}</span>

              {view === v.id && (
                <Zap className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-yellow-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Status hint */}
        <div className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-2 opacity-80">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b98180]" />
          Vault connection active • Alt+P / Alt+S to switch
        </div>
      </div>

      {/* Main content with fade transition */}
      <div
        className={`
          transition-opacity duration-${TRANSITION_MS} ease-in-out
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {view === 'staff' ? <PhillipstonGovernanceOS /> : <PublicPortal />}
      </div>

      <Toaster
        position="bottom-left"
        toastOptions={{
          className: 'border border-slate-200 shadow-xl',
          style: { background: 'white', color: '#0f172a' }
        }}
      />
    </div>
  );
}