import React, { useMemo } from 'react'
import { type AgendaItem, useLogicvilleAgendaStore } from './logicvilleAgendaStore'

function normalizeText(v: unknown) {
  return String(v ?? '').trim()
}

function toDateInputValue(d: Date) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseYmd(ymd: string | undefined) {
  const s = normalizeText(ymd)
  if (!s) return null
  const d = new Date(s)
  if (Number.isNaN(d.valueOf())) return null
  return d
}

function startOfWeekMonday(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeekSunday(date = new Date()) {
  const start = startOfWeekMonday(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function inRange(d: Date, start: Date, end: Date) {
  return d.valueOf() >= start.valueOf() && d.valueOf() <= end.valueOf()
}

function PublicLine({ item }: { item: AgendaItem }) {
  return (
    <div className="public-line">
      <div className="public-line-top">
        <strong className="public-line-title">
          {item.id} • {item.title}
        </strong>
        <span className="public-line-meta">
          {[item.status, item.dueDate].filter(Boolean).join(' • ') || '—'}
        </span>
      </div>
      <div className="public-line-body">{item.publicSummary || '—'}</div>
    </div>
  )
}

export default function LogicvilleLivingAgendaPublic() {
  const { items } = useLogicvilleAgendaStore()

  const publicItems = useMemo(() => items.filter((it) => it.isPublic), [items])
  const weekStart = useMemo(() => startOfWeekMonday(new Date()), [])
  const weekEnd = useMemo(() => endOfWeekSunday(new Date()), [])
  const tenDaysOut = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 10)
    d.setHours(23, 59, 59, 999)
    return d
  }, [])

  const publicActions = useMemo(() => publicItems.filter((it) => it.kind === 'Action'), [publicItems])
  const publicDecisions = useMemo(() => publicItems.filter((it) => it.kind === 'Decision'), [publicItems])
  const publicProjects = useMemo(() => publicItems.filter((it) => it.kind === 'Project'), [publicItems])
  const publicRisks = useMemo(() => publicItems.filter((it) => it.kind === 'Risk'), [publicItems])

  const thisWeek = useMemo(() => {
    return publicActions
      .filter((it) => {
        const due = parseYmd(it.dueDate)
        if (!due) return false
        return inRange(due, weekStart, weekEnd)
      })
      .sort((a, b) => normalizeText(a.dueDate).localeCompare(normalizeText(b.dueDate)))
  }, [publicActions, weekStart, weekEnd])

  const next10 = useMemo(() => {
    return publicActions
      .filter((it) => {
        const due = parseYmd(it.dueDate)
        if (!due) return false
        return due.valueOf() <= tenDaysOut.valueOf()
      })
      .sort((a, b) => normalizeText(a.dueDate).localeCompare(normalizeText(b.dueDate)))
  }, [publicActions, tenDaysOut])

  return (
    <div className="public-portal">
      <section className="hero public-hero">
        <div className="hero-copy" data-animate="rise">
          <div className="hero-kicker">Logicville Public View</div>
          <h1>Living Agenda (PublicLogic™)</h1>
          <p className="hero-subtitle">
            This is the public-safe view of the working agenda. Sensitive details are intentionally omitted.
          </p>
          <div className="hero-meta">
            <span className="tag">
              Week: {toDateInputValue(weekStart)}–{toDateInputValue(weekEnd)}
            </span>
            <span className="tag">WCAG-minded</span>
            <span className="tag">No PII</span>
          </div>
        </div>
        <div className="hero-panel" data-animate="rise">
          <div className="hero-panel-title">What you’ll see here</div>
          <div className="hero-panel-row">
            <span>Action items</span>
            <strong>public-safe only</strong>
          </div>
          <div className="hero-panel-row">
            <span>Decisions</span>
            <strong>summarized</strong>
          </div>
          <div className="hero-panel-row">
            <span>Projects</span>
            <strong>high-level</strong>
          </div>
        </div>
      </section>

      <section className="public-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>This Week</h2>
              <p>Public action items due this week (Mon–Sun).</p>
            </div>
          </div>
          {thisWeek.length === 0 ? (
            <p className="case-meta">No public items posted for this week.</p>
          ) : (
            <div className="public-lines">
              {thisWeek.slice(0, 12).map((it) => (
                <PublicLine key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Next 10 Days</h2>
              <p>Public action items due soon.</p>
            </div>
          </div>
          {next10.length === 0 ? (
            <p className="case-meta">No public items due in the next 10 days.</p>
          ) : (
            <div className="public-lines">
              {next10.slice(0, 12).map((it) => (
                <PublicLine key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Decision Log (Public)</h2>
            <p>High-level decisions and outcomes.</p>
          </div>
        </div>
        {publicDecisions.length === 0 ? (
          <p className="case-meta">No public decisions posted.</p>
        ) : (
          <div className="public-lines">
            {publicDecisions
              .slice()
              .sort((a, b) => normalizeText(b.dueDate).localeCompare(normalizeText(a.dueDate)))
              .slice(0, 12)
              .map((it) => (
                <PublicLine key={it.id} item={it} />
              ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Project Portfolio (Public)</h2>
            <p>Active initiatives with compliance checkpoints and funding labels.</p>
          </div>
        </div>
        {publicProjects.length === 0 ? (
          <p className="case-meta">No public projects posted.</p>
        ) : (
          <div className="public-lines">
            {publicProjects.slice(0, 12).map((it) => (
              <div key={it.id} className="public-line">
                <div className="public-line-top">
                  <strong className="public-line-title">
                    {it.id} • {it.title}
                  </strong>
                  <span className="public-line-meta">
                    {[it.module, it.dueDate].filter(Boolean).join(' • ') || '—'}
                  </span>
                </div>
                <div className="public-line-body">{it.publicSummary || '—'}</div>
                <div className="public-line-meta" style={{ marginTop: 6 }}>
                  {[it.compliance, it.funding].filter(Boolean).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {publicRisks.length > 0 ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Risk Watch (Public)</h2>
              <p>Only risks explicitly marked public.</p>
            </div>
          </div>
          <div className="public-lines">
            {publicRisks.slice(0, 12).map((it) => (
              <PublicLine key={it.id} item={it} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Notes</h2>
            <p>
              This is a living working agenda. For records requests, refer to town public records procedures.
            </p>
          </div>
        </div>
        <p className="case-meta">
          OML/PRR flags may be used internally to ensure agendas, notices, and records are handled correctly.
        </p>
      </section>
    </div>
  )
}

