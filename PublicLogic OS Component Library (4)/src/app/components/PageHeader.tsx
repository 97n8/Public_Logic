import type { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
          PublicLogic OS
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

