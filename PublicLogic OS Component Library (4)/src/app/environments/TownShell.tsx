import { ArrowLeft, Landmark } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";

export default function TownShell({
  town,
  subtitle,
  children,
  className,
  homeTo,
  homeLabel,
}: {
  town: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  homeTo?: string;
  homeLabel?: string;
}) {
  const linkTo = homeTo ?? "/dashboard";
  const label = homeLabel ?? (homeTo ? "Home" : "Portal");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousTitle = document.title;
    document.title = `Town of ${town} — ${subtitle}`;
    return () => {
      document.title = previousTitle;
    };
  }, [town, subtitle]);

  return (
    <div className={["env", className].filter(Boolean).join(" ")}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
                Governed Space
              </div>
              <div className="truncate text-lg font-black tracking-tight text-foreground">
                Town of {town}
              </div>
              <div className="truncate text-xs font-semibold text-muted-foreground">
                {subtitle}
              </div>
            </div>
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-black uppercase tracking-widest text-foreground hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {label}
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
