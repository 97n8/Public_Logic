import { Link } from "react-router-dom";
import { ENVIRONMENTS } from "../environments";

export default function FrontDoor() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
              PublicLogic OS
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              App Front Door
            </h1>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600">
              Choose an environment. Each environment can host modules like Case
              Space and PRR, connected in-house through Microsoft 365.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ENVIRONMENTS.filter((e) => e.id !== "publiclogic").map((env) => (
              <Link
                key={env.id}
                to={`/env/${env.id}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
              >
                <div className="text-lg font-black text-slate-900">
                  {env.name}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-600">
                  {env.description}
                </div>
                <div className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
                  Open →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/env/princeton/case-space"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              Princeton Case Space
            </Link>
            <Link
              to="/env/princeton/prr"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Princeton PRR
            </Link>
          </div>

          <div className="mt-8 text-xs font-medium text-slate-500">
            Tip: this is a single-page app. Deep links like{" "}
            <span className="font-mono">/env/princeton/prr</span> work when the
            host rewrites to <span className="font-mono">/hmlp/index.html</span>
            (Netlify already does this).
          </div>
        </div>
      </div>
    </div>
  );
}

