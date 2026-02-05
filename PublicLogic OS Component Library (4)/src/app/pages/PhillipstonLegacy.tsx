import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { Toaster } from "sonner";
import PhillipstonGovernanceOS from "../components/PhillipstonGovernanceOS";
import PublicPortal from "../components/PublicPortal";

type ViewMode = "public" | "staff";

const TRANSITION_MS = 280;
const LOCAL_STORAGE_WELCOME = "phillipston-welcome-dismissed";
const LOCAL_STORAGE_VIEW = "phillipston-view";

type IconComp = React.ComponentType<{ className?: string }>;

interface ViewItem {
  id: ViewMode;
  label: string;
  icon: IconComp;
  shortcut: string;
  activeClass: string;
}

function ViewToggleButton({
  viewItem,
  selected,
  onClick,
}: {
  viewItem: ViewItem;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = viewItem.icon;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={`view-panel-${viewItem.id}`}
      onClick={onClick}
      title={`Switch to ${viewItem.label} (${viewItem.shortcut})`}
      className={[
        "relative flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2",
        selected
          ? `${viewItem.activeClass} scale-105 shadow-lg`
          : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{viewItem.label}</span>
      {selected && (
        <Zap className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 animate-pulse text-yellow-400" />
      )}
    </button>
  );
}

export default function PhillipstonLegacy() {
  // view state (default to staff). We restore from localStorage on mount.
  const [view, setView] = useState<ViewMode>("staff");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Welcome banner state: initialize false and decide on mount to avoid SSR hydration issues.
  const [showWelcome, setShowWelcome] = useState(false);

  // refs for timers and transition lock to avoid stale closures and to cleanup on unmount.
  const transitionTimerRef = useRef<number | null>(null);
  const welcomeTimerRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  // Views metadata
  const views = useMemo<ViewItem[]>(
    () => [
      {
        id: "public",
        label: "Resident Portal",
        icon: Building2,
        shortcut: "Alt+P",
        activeClass:
          "bg-gradient-to-br from-slate-700 to-slate-600 shadow-slate-900/40 text-white",
      },
      {
        id: "staff",
        label: "Staff Dashboard",
        icon: ShieldCheck,
        shortcut: "Alt+S",
        activeClass:
          "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-900/30 text-white",
      },
    ],
    [],
  );

  // On mount: restore persisted view, and decide whether to show welcome.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedView = localStorage.getItem(LOCAL_STORAGE_VIEW) as ViewMode | null;
    if (savedView === "public" || savedView === "staff") {
      setView(savedView);
    }

    const dismissed = localStorage.getItem(LOCAL_STORAGE_WELCOME) === "true";
    if (!dismissed) {
      setShowWelcome(true);
      welcomeTimerRef.current = window.setTimeout(() => {
        setShowWelcome(false);
        welcomeTimerRef.current = null;
      }, 8000);
    }

    return () => {
      if (welcomeTimerRef.current) {
        window.clearTimeout(welcomeTimerRef.current);
        welcomeTimerRef.current = null;
      }
    };
  }, []);

  // When showWelcome becomes false due to dismissal, persist that so we don't re-show later.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!showWelcome) {
      // Save that it was dismissed so it won't reappear on future visits.
      localStorage.setItem(LOCAL_STORAGE_WELCOME, "true");
      if (welcomeTimerRef.current) {
        window.clearTimeout(welcomeTimerRef.current);
        welcomeTimerRef.current = null;
      }
    }
  }, [showWelcome]);

  // Persist view when it changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_VIEW, view);
  }, [view]);

  // Clean up transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      if (welcomeTimerRef.current) {
        window.clearTimeout(welcomeTimerRef.current);
        welcomeTimerRef.current = null;
      }
    };
  }, []);

  // Safely handle view change with a transition and guard against rapid clicks.
  const handleViewChange = useCallback(
    (newView: ViewMode) => {
      if (newView === view || isTransitioningRef.current) return;

      // mark transitioning in both ref and state
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }

      transitionTimerRef.current = window.setTimeout(() => {
        setView(newView);
        setIsTransitioning(false);
        isTransitioningRef.current = false;
        if (transitionTimerRef.current) {
          window.clearTimeout(transitionTimerRef.current);
          transitionTimerRef.current = null;
        }
      }, TRANSITION_MS);
    },
    [view],
  );

  // Keyboard shortcuts (Alt+P / Alt+S). Throttle rapid keypresses using a small timeout.
  useEffect(() => {
    let keyCooldown: number | null = null;
    const handler = (e: KeyboardEvent) => {
      // ignore when typing into inputs
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (!e.altKey) return;
      if (keyCooldown) return;

      const key = e.key.toLowerCase();
      if (key === "p") {
        e.preventDefault();
        handleViewChange("public");
      } else if (key === "s") {
        e.preventDefault();
        handleViewChange("staff");
      }

      keyCooldown = window.setTimeout(() => {
        if (keyCooldown) {
          window.clearTimeout(keyCooldown);
          keyCooldown = null;
        }
      }, 400);
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (keyCooldown) {
        window.clearTimeout(keyCooldown);
        keyCooldown = null;
      }
    };
  }, [handleViewChange]);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    // localStorage is set by effect watching showWelcome
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {showWelcome && (
        <div className="fixed left-1/2 top-5 z-[1000] -translate-x-1/2 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-7 py-4 text-sm font-medium text-slate-800 shadow-2xl backdrop-blur-lg">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span>Phillipston Governance OS — legacy demo screens (kept as reference)</span>
            <button
              onClick={dismissWelcome}
              className="ml-2 rounded-full p-1.5 transition-colors hover:bg-slate-100"
              aria-label="Dismiss welcome message"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end gap-4">
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/90 p-2.5 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
          <div role="tablist" aria-label="View switcher" className="flex items-center gap-1.5">
            {views.map((v) => (
              <ViewToggleButton
                key={v.id}
                viewItem={v}
                selected={view === v.id}
                onClick={() => handleViewChange(v.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 opacity-80">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b98180]" />
          Demo connection • Alt+P / Alt+S to switch
        </div>
      </div>

      <div
        id={`view-panel-${view}`}
        aria-live="polite"
        className={isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"}
        style={{ transition: `opacity ${TRANSITION_MS}ms ease-in-out` }}
      >
        {view === "staff" ? <PhillipstonGovernanceOS /> : <PublicPortal />}
      </div>

      <Toaster
        position="bottom-left"
        toastOptions={{
          className: "border border-slate-200 shadow-xl",
          style: { background: "white", color: "#0f172a" },
        }}
      />
    </div>
  );
}
