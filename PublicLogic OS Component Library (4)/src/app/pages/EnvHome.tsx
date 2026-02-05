import { Link, useParams } from "react-router-dom";
import { getEnvironment } from "../environments";

export default function EnvHome() {
  const { envId } = useParams();
  const env = getEnvironment(envId);

  if (!env) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow">
          <div className="text-sm font-black uppercase tracking-widest text-red-600">
            Unknown environment
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900">
            No environment found for: <span className="font-mono">{envId}</span>
          </div>
          <div className="mt-6">
            <Link
              to="/"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white"
            >
              Back to front door
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
            Environment
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            {env.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
            {env.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={`/env/${env.id}/case-space`}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              Case Space
            </Link>
            <Link
              to={`/env/${env.id}/prr`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              PRR Module
            </Link>
            <Link
              to="/"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Front door
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

