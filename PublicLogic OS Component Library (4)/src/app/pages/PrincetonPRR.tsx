import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { acquireToken } from "../../lib/auth";
import { createSharePointClient } from "../lib/sharepoint-client";
import { IS_DEMO } from "../../runtime";

type PrrRequest = {
  itemId: string;
  Title?: string;
  Status?: string;
  Created?: string;
  webUrl?: string;
};

export default function PrincetonPRR() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<PrrRequest[] | null>(null);

  const listName = useMemo(
    () => import.meta.env.VITE_PRR_LIST_NAME || "PRR Requests",
    [],
  );

  async function handleLoad() {
    setError(null);
    setIsConnecting(true);
    try {
      if (IS_DEMO) {
        setRequests([
          {
            itemId: "demo-1",
            Title: "Police logs (Jan 2026)",
            Status: "Open",
            Created: "2026-02-02",
            webUrl: "#",
          },
          {
            itemId: "demo-2",
            Title: "Payroll records (Q4 2025)",
            Status: "Completed",
            Created: "2026-01-18",
            webUrl: "#",
          },
        ]);
        return;
      }

      const { accessToken } = await acquireToken();
      const sp = createSharePointClient(accessToken);
      const items = await sp.listItems(listName, { top: 50 });
      setRequests(items);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
            Princeton • PRR Module
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            Public Records Requests
          </h1>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
            In-house PRR module intended to run on Microsoft 365 (Graph +
            SharePoint Lists). This page loads from the SharePoint list{" "}
            <span className="rounded bg-slate-100 px-2 py-1 font-mono text-sm">
              {listName}
            </span>
            .
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleLoad}
              disabled={isConnecting}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnecting ? "Connecting…" : "Load requests"}
            </button>
            <Link
              to="/env/princeton/case-space"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Case Space
            </Link>
            <Link
              to="/env/princeton"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Princeton home
            </Link>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-800">
              {error}
            </div>
          )}

          <div className="mt-10">
            {requests === null ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                No data loaded yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-12 gap-0 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500">
                  <div className="col-span-6">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Link</div>
                </div>
                {requests.map((r) => (
                  <div
                    key={r.itemId}
                    className="grid grid-cols-12 gap-0 border-t border-slate-200 px-6 py-4 text-sm font-semibold text-slate-800"
                  >
                    <div className="col-span-6">{r.Title || "(untitled)"}</div>
                    <div className="col-span-2">{r.Status || "-"}</div>
                    <div className="col-span-2">
                      {r.Created ? String(r.Created).slice(0, 10) : "-"}
                    </div>
                    <div className="col-span-2">
                      {r.webUrl ? (
                        <a
                          href={r.webUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 underline underline-offset-4"
                        >
                          Open
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

