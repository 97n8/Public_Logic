import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { Toaster } from "sonner";
import PhillipstonGovernanceOS from "../components/PhillipstonGovernanceOS";
import PublicPortal from "../components/PublicPortal";

type ViewMode = "public" | "staff";

const TRANSITION_MS = 280;

export default function PhillipstonLegacy() {
  const [view, setView] = useState<ViewMode>("staff");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return (
      typeof window !== "undefined" &&
      !localStorage.getItem("phillipston-welcome-dismissed")
    );
  });

  useEffect(() => {
    if (!showWelcome) localStorage.setItem("phillipston-welcome-dismissed", "true");
  }, [showWelcome]);

  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  const handleViewChange = useCallback(
    (newView: ViewMode) => {
      if (newView === view || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setView(newView);
        setIsTransitioning(false);
      }, TRANSITION_MS);
    },
    [view, isTransitioning],
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const handler = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName))
        return;
      if (timeout) return;
      if (!e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === "p") {
        e.preventDefault();
        handleViewChange("public");
      } else if (key === "s") {
        e.preventDefault();
        handleViewChange("staff");
      }

      timeout = setTimeout(() => {
        timeout = null;
      }, 400);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleViewChange]);

  const views = useMemo(
    () => [
      {
        id: "public" as const,
        label: "Resident Portal",
        icon: Building2,
        shortcut: "Alt+P",
        active:
          "bg-gradient-to-br from-slate-700 to-slate-600 shadow-slate-900/40 text-white",
      },
      {
        id: "staff" as const,
        label: "Staff Dashboard",
        icon: ShieldCheck,
        shortcut: "Alt+S",
        active:
          "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-900/30 text-white",
      },
    ],
    [],
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {showWelcome && (
        <div className="fixed left-1/2 top-5 z-[1000] -translate-x-1/2 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 px-7 py-4 text-sm font-medium text-slate-800 shadow-2xl backdrop-blur-lg">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span>
              Phillipston Governance OS — legacy demo screens (kept as reference)
            </span>
            <button
              onClick={() => setShowWelcome(false)}
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
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => handleViewChange(v.id)}
              className={[
                "relative flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ease-out",
                "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2",
                view === v.id
                  ? `${v.active} scale-105 shadow-lg`
                  : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900",
              ].join(" ")}
              title={`Switch to ${v.label} (${v.shortcut})`}
              aria-label={`Switch to ${v.label}`}
              aria-selected={view === v.id}
            >
              <v.icon className="h-4 w-4" />
              <span>{v.label}</span>
              {view === v.id && (
                <Zap className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 animate-pulse text-yellow-400" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 opacity-80">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b98180]" />
          Demo connection • Alt+P / Alt+S to switch
        </div>
      </div>

      <div
        className={isTransitioning ? "opacity-0" : "opacity-100"}
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
