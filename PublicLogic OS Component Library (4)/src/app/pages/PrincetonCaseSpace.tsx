import { Link } from "react-router-dom";

export default function PrincetonCaseSpace() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
            Princeton • Case Space
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            Case Space
          </h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
            This is the Princeton sub-app. Next step is wiring Case Space to
            Microsoft 365 (Graph + SharePoint/Lists) for in-house case records,
            tasks, and audit trails.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-black uppercase tracking-widest text-slate-500">
                Cases
              </div>
              <div className="mt-2 text-base font-bold text-slate-900">
                Browse + search case folders
              </div>
              <div className="mt-2 text-sm font-medium text-slate-600">
                Backed by SharePoint document libraries and metadata lists.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-black uppercase tracking-widest text-slate-500">
                Workflow
              </div>
              <div className="mt-2 text-base font-bold text-slate-900">
                Intake → processing → archive
              </div>
              <div className="mt-2 text-sm font-medium text-slate-600">
                UI shell is ready; module wiring comes next.
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/env/princeton/prr"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              Go to PRR module
            </Link>
            <Link
              to="/env/princeton"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Back to Princeton home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

