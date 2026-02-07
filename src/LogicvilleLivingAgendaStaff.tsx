import React, { useMemo, useState } from 'react'
import {
  type AgendaItem,
  type AgendaKind,
  type RiskLevel,
  useLogicvilleAgendaStore,
} from './logicvilleAgendaStore'

const KINDS: AgendaKind[] = ['Action', 'Decision', 'Risk', 'Project', 'Note']
const RISK_LEVELS: RiskLevel[] = ['Low', 'Med', 'High']

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

function statusKey(status: string | undefined) {
  const s = normalizeText(status).toLowerCase()
  if (!s) return 'unknown'
  if (s === 'done' || s === 'complete' || s === 'closed') return 'done'
  if (s === 'blocked') return 'blocked'
  if (s === 'not started') return 'not-started'
  if (s === 'in progress' || s === 'active' || s === 'mitigating') return 'in-progress'
  if (s === 'open' || s === 'watching') return 'open'
  if (s === 'decided') return 'decided'
  return 'unknown'
}

function StatusPill({ status }: { status?: string }) {
  const label = normalizeText(status) || '—'
  return <span className={`status-pill status-${statusKey(status)}`}>{label}</span>
}

function KindTag({ kind }: { kind: AgendaKind }) {
  return <span className="tag">{kind}</span>
}

function safeCountLabel(n: number, singular: string, plural: string) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`
}

type Draft = {
  kind: AgendaKind
  title: string
  owner: string
  dueDate: string
  status: string
  dod: string
  details: string
  isPublic: boolean
  publicSummary: string
  oml: boolean
  prr: boolean
  retentionTag: string
  impactedDepts: string
  likelihood: '' | RiskLevel
  impact: '' | RiskLevel
  mitigation: string
  module: string
  funding: string
  compliance: string
  links: string
}

function defaultDraft(today: string): Draft {
  return {
    kind: 'Action',
    title: '',
    owner: 'Nate',
    dueDate: today,
    status: 'Not Started',
    dod: '',
    details: '',
    isPublic: false,
    publicSummary: '',
    oml: false,
    prr: false,
    retentionTag: '',
    impactedDepts: '',
    likelihood: '',
    impact: '',
    mitigation: '',
    module: '',
    funding: '',
    compliance: '',
    links: '',
  }
}

export default function LogicvilleLivingAgendaStaff() {
  const { items, addItem, updateItem, removeItem, reset } = useLogicvilleAgendaStore()

  const today = useMemo(() => toDateInputValue(new Date()), [])
  const [draft, setDraft] = useState<Draft>(() => defaultDraft(today))

  const [query, setQuery] = useState('')
  const [kindFilter, setKindFilter] = useState<'All' | AgendaKind>('All')
  const [selectedId, setSelectedId] = useState<string>(() => items[0]?.id ?? '')

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      const kindOk = kindFilter === 'All' || it.kind === kindFilter
      if (!kindOk) return false
      if (!q) return true
      const hay = `${it.id} ${it.kind} ${it.title} ${it.owner} ${it.status} ${it.module}`.toLowerCase()
      return hay.includes(q)
    })
  }, [items, kindFilter, query])

  const selectedItem: AgendaItem | undefined =
    items.find((it) => it.id === selectedId) ?? filteredItems[0] ?? items[0]

  const weekStart = useMemo(() => startOfWeekMonday(new Date()), [])
  const weekEnd = useMemo(() => endOfWeekSunday(new Date()), [])
  const tenDaysOut = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 10)
    d.setHours(23, 59, 59, 999)
    return d
  }, [])

  const actionItems = useMemo(() => items.filter((it) => it.kind === 'Action'), [items])
  const decisionItems = useMemo(() => items.filter((it) => it.kind === 'Decision'), [items])
  const riskItems = useMemo(() => items.filter((it) => it.kind === 'Risk'), [items])
  const projectItems = useMemo(() => items.filter((it) => it.kind === 'Project'), [items])

  const openActions = useMemo(
    () =>
      actionItems.filter((it) => {
        const s = normalizeText(it.status).toLowerCase()
        return !['done', 'complete', 'closed'].includes(s)
      }),
    [actionItems]
  )

  const thisWeekActions = useMemo(() => {
    return openActions
      .filter((it) => {
        const due = parseYmd(it.dueDate)
        if (!due) return false
        return inRange(due, weekStart, weekEnd)
      })
      .sort((a, b) => normalizeText(a.dueDate).localeCompare(normalizeText(b.dueDate)))
  }, [openActions, weekStart, weekEnd])

  const nextTenDaysActions = useMemo(() => {
    return openActions
      .filter((it) => {
        const due = parseYmd(it.dueDate)
        if (!due) return false
        return due.valueOf() <= tenDaysOut.valueOf()
      })
      .sort((a, b) => normalizeText(a.dueDate).localeCompare(normalizeText(b.dueDate)))
  }, [openActions, tenDaysOut])

  const redFlags = useMemo(() => {
    return riskItems.filter((it) => {
      const impact = normalizeText(it.impact).toLowerCase()
      const likelihood = normalizeText(it.likelihood).toLowerCase()
      const status = normalizeText(it.status).toLowerCase()
      return impact === 'high' || likelihood === 'high' || status === 'blocked'
    })
  }, [riskItems])

  function setDraftField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function validateDraft(d: Draft) {
    const errs: string[] = []
    if (!normalizeText(d.title)) errs.push('Title is required.')

    if (d.kind === 'Action') {
      if (!normalizeText(d.owner)) errs.push('Action requires Owner.')
      if (!normalizeText(d.dueDate)) errs.push('Action requires Due date (YYYY-MM-DD).')
      if (!normalizeText(d.dod)) errs.push('Action requires DoD.')
    }

    if (d.isPublic && !normalizeText(d.publicSummary)) {
      errs.push('Public items require a public-safe summary.')
    }

    return errs
  }

  function createItem() {
    const errs = validateDraft(draft)
    if (errs.length > 0) {
      window.alert(errs.join('\n'))
      return
    }

    addItem({
      kind: draft.kind,
      title: normalizeText(draft.title),
      owner: normalizeText(draft.owner),
      dueDate: normalizeText(draft.dueDate) || undefined,
      status: normalizeText(draft.status) || undefined,
      dod: normalizeText(draft.dod) || undefined,
      details: normalizeText(draft.details) || undefined,
      isPublic: Boolean(draft.isPublic),
      publicSummary: normalizeText(draft.publicSummary) || undefined,
      oml: draft.oml || undefined,
      prr: draft.prr || undefined,
      retentionTag: normalizeText(draft.retentionTag) || undefined,
      impactedDepts: normalizeText(draft.impactedDepts) || undefined,
      likelihood: draft.likelihood || undefined,
      impact: draft.impact || undefined,
      mitigation: normalizeText(draft.mitigation) || undefined,
      module: normalizeText(draft.module) || undefined,
      funding: normalizeText(draft.funding) || undefined,
      compliance: normalizeText(draft.compliance) || undefined,
      links: normalizeText(draft.links) || undefined,
    })

    setDraft(defaultDraft(today))
  }

  function deleteSelected() {
    if (!selectedItem) return
    const ok = window.confirm(`Delete ${selectedItem.id}?`)
    if (!ok) return
    removeItem(selectedItem.id)
    setSelectedId('')
  }

  return (
    <div className="case-space">
      <section className="hero">
        <div className="hero-copy" data-animate="rise">
          <div className="hero-kicker">Logicville, Massachusetts</div>
          <h1>Living Agenda (PublicLogic™)</h1>
          <p className="hero-subtitle">
            One workspace for decisions, priorities, and handoffs. Action-first. Zero clutter.
          </p>
          <div className="hero-meta">
            <span className="tag">
              Week: {toDateInputValue(weekStart)}–{toDateInputValue(weekEnd)}
            </span>
            <span className="tag">Internal view</span>
            <span className="tag">No PII</span>
          </div>
          <div className="hero-actions">
            <button className="btn primary" onClick={createItem}>
              Add intake item
            </button>
            <button className="btn ghost" onClick={() => reset()}>
              Reset demo data
            </button>
          </div>
        </div>
        <div className="hero-panel" data-animate="rise">
          <div className="hero-panel-title">Working Rules</div>
          <div className="hero-panel-row">
            <span>Every task</span>
            <strong>Owner • Due • DoD</strong>
          </div>
          <div className="hero-panel-row">
            <span>Compliance flags</span>
            <strong>OML / PRR</strong>
          </div>
          <div className="hero-panel-row">
            <span>Public artifacts</span>
            <strong>WCAG 2.1 AA</strong>
          </div>
        </div>
      </section>

      <section className="metrics">
        <div className="card" data-animate="rise">
          <div className="card-label">Open actions</div>
          <div className="card-value">{openActions.length}</div>
          <div className="card-meta">{safeCountLabel(openActions.length, 'item', 'items')}</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">This week</div>
          <div className="card-value">{thisWeekActions.length}</div>
          <div className="card-meta">due by Sunday</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Risks</div>
          <div className="card-value">{riskItems.length}</div>
          <div className="card-meta">{redFlags.length} red flags</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Projects</div>
          <div className="card-value">{projectItems.length}</div>
          <div className="card-meta">active initiatives</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Decisions</div>
          <div className="card-value">{decisionItems.length}</div>
          <div className="card-meta">logged</div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Singular intake</h2>
              <p>Create one item, then view it as Action/Decision/Risk/Project.</p>
            </div>
          </div>

          <div className="agenda-form">
            <div className="agenda-form-row">
              <label className="agenda-label">Kind</label>
              <select
                className="input"
                value={draft.kind}
                onChange={(e) => setDraftField('kind', e.target.value as AgendaKind)}
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="agenda-form-row">
              <label className="agenda-label">Title</label>
              <input
                className="input agenda-full"
                value={draft.title}
                onChange={(e) => setDraftField('title', e.target.value)}
                placeholder="Plain language, actionable"
              />
            </div>

            <div className="agenda-form-grid">
              <div className="agenda-form-row">
                <label className="agenda-label">Owner</label>
                <select
                  className="input"
                  value={draft.owner}
                  onChange={(e) => setDraftField('owner', e.target.value)}
                >
                  <option value="Nate">Nate</option>
                  <option value="Allie">Allie</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="agenda-form-row">
                <label className="agenda-label">
                  {draft.kind === 'Decision' ? 'Date' : draft.kind === 'Project' ? 'Target' : 'Due'}
                </label>
                <input
                  className="input"
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => setDraftField('dueDate', e.target.value)}
                />
              </div>

              <div className="agenda-form-row">
                <label className="agenda-label">Status</label>
                <input
                  className="input"
                  value={draft.status}
                  onChange={(e) => setDraftField('status', e.target.value)}
                  placeholder="Not Started / In Progress / Done"
                />
              </div>
            </div>

            <div className="agenda-form-row">
              <label className="agenda-label">DoD (Definition of Done)</label>
              <textarea
                className="input agenda-textarea"
                value={draft.dod}
                onChange={(e) => setDraftField('dod', e.target.value)}
                placeholder="Objective, testable completion criteria"
              />
            </div>

            <div className="agenda-form-row">
              <label className="agenda-label">Details (Internal — no PII)</label>
              <textarea
                className="input agenda-textarea"
                value={draft.details}
                onChange={(e) => setDraftField('details', e.target.value)}
                placeholder="Context, constraints, links (no sensitive data)"
              />
            </div>

            <div className="agenda-form-grid">
              <div className="agenda-form-row agenda-check">
                <label className="agenda-label">Public</label>
                <label className="agenda-checkline">
                  <input
                    type="checkbox"
                    checked={draft.isPublic}
                    onChange={(e) => setDraftField('isPublic', e.target.checked)}
                  />
                  <span>Include in public view</span>
                </label>
              </div>
              <div className="agenda-form-row">
                <label className="agenda-label">Public summary (safe)</label>
                <input
                  className="input"
                  value={draft.publicSummary}
                  onChange={(e) => setDraftField('publicSummary', e.target.value)}
                  placeholder="Shareable summary (no internal notes)"
                />
              </div>
            </div>

            <details className="agenda-details">
              <summary>Compliance + advanced fields</summary>
              <div className="agenda-advanced">
                <div className="agenda-form-grid">
                  <div className="agenda-form-row agenda-check">
                    <label className="agenda-label">OML (M.G.L. c.30A)</label>
                    <label className="agenda-checkline">
                      <input
                        type="checkbox"
                        checked={draft.oml}
                        onChange={(e) => setDraftField('oml', e.target.checked)}
                      />
                      <span>Flagged</span>
                    </label>
                  </div>
                  <div className="agenda-form-row agenda-check">
                    <label className="agenda-label">PRR (M.G.L. c.66 §10)</label>
                    <label className="agenda-checkline">
                      <input
                        type="checkbox"
                        checked={draft.prr}
                        onChange={(e) => setDraftField('prr', e.target.checked)}
                      />
                      <span>Flagged</span>
                    </label>
                  </div>
                </div>

                <div className="agenda-form-grid">
                  <div className="agenda-form-row">
                    <label className="agenda-label">Retention tag</label>
                    <input
                      className="input"
                      value={draft.retentionTag}
                      onChange={(e) => setDraftField('retentionTag', e.target.value)}
                    />
                  </div>
                  <div className="agenda-form-row">
                    <label className="agenda-label">Impacted depts</label>
                    <input
                      className="input"
                      value={draft.impactedDepts}
                      onChange={(e) => setDraftField('impactedDepts', e.target.value)}
                    />
                  </div>
                </div>

                <div className="agenda-form-grid">
                  <div className="agenda-form-row">
                    <label className="agenda-label">Likelihood</label>
                    <select
                      className="input"
                      value={draft.likelihood}
                      onChange={(e) => setDraftField('likelihood', e.target.value as Draft['likelihood'])}
                    >
                      <option value="">—</option>
                      {RISK_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="agenda-form-row">
                    <label className="agenda-label">Impact</label>
                    <select
                      className="input"
                      value={draft.impact}
                      onChange={(e) => setDraftField('impact', e.target.value as Draft['impact'])}
                    >
                      <option value="">—</option>
                      {RISK_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="agenda-form-row">
                  <label className="agenda-label">Mitigation</label>
                  <textarea
                    className="input agenda-textarea"
                    value={draft.mitigation}
                    onChange={(e) => setDraftField('mitigation', e.target.value)}
                  />
                </div>

                <div className="agenda-form-grid">
                  <div className="agenda-form-row">
                    <label className="agenda-label">Module</label>
                    <input
                      className="input"
                      value={draft.module}
                      onChange={(e) => setDraftField('module', e.target.value)}
                      placeholder="CLERK / FIX / AGENDA"
                    />
                  </div>
                  <div className="agenda-form-row">
                    <label className="agenda-label">Funding</label>
                    <input
                      className="input"
                      value={draft.funding}
                      onChange={(e) => setDraftField('funding', e.target.value)}
                    />
                  </div>
                </div>

                <div className="agenda-form-grid">
                  <div className="agenda-form-row">
                    <label className="agenda-label">Compliance checkpoints</label>
                    <input
                      className="input"
                      value={draft.compliance}
                      onChange={(e) => setDraftField('compliance', e.target.value)}
                    />
                  </div>
                  <div className="agenda-form-row">
                    <label className="agenda-label">Links</label>
                    <input
                      className="input"
                      value={draft.links}
                      onChange={(e) => setDraftField('links', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </details>

            <div className="hero-actions">
              <button className="btn primary" type="button" onClick={createItem}>
                Create
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setDraft(defaultDraft(today))}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="panel-header" style={{ marginTop: 22 }}>
            <div>
              <h2>Intake items</h2>
              <p>Search, filter, and open an item workspace.</p>
            </div>
            <div className="panel-controls">
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
              />
              <select
                className="input"
                value={kindFilter}
                onChange={(e) =>
                  setKindFilter(e.target.value === 'All' ? 'All' : (e.target.value as AgendaKind))
                }
              >
                <option value="All">All</option>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="cases-table agenda-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kind</th>
                  <th>Title</th>
                  <th>Owner</th>
                  <th>Due/Date</th>
                  <th>Status</th>
                  <th>Public</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((it) => (
                  <tr
                    key={it.id}
                    className={it.id === selectedItem?.id ? 'active-row' : ''}
                    onClick={() => setSelectedId(it.id)}
                  >
                    <td className="case-id">{it.id}</td>
                    <td>
                      <KindTag kind={it.kind} />
                    </td>
                    <td>
                      <div className="case-name">{it.title}</div>
                      <div className="case-meta">{it.publicSummary ? it.publicSummary : '—'}</div>
                    </td>
                    <td>{it.owner || '—'}</td>
                    <td>{it.dueDate || '—'}</td>
                    <td>
                      <StatusPill status={it.status} />
                    </td>
                    <td>{it.isPublic ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Item workspace</h2>
              <p>Decisions, notes, and handoffs (internal). Public view only shows the safe summary.</p>
            </div>
            <div className="panel-controls">
              <button className="btn ghost" onClick={deleteSelected} disabled={!selectedItem}>
                Delete
              </button>
              <button className="btn ghost" onClick={() => selectedItem && updateItem(selectedItem.id, { status: 'Done' })} disabled={!selectedItem}>
                Mark done
              </button>
              <button
                className="btn primary"
                onClick={() =>
                  selectedItem &&
                  updateItem(selectedItem.id, { isPublic: !selectedItem.isPublic })
                }
                disabled={!selectedItem}
              >
                {selectedItem?.isPublic ? 'Make internal' : 'Make public'}
              </button>
            </div>
          </div>

          {selectedItem ? (
            <div className="agenda-item">
              <div className="agenda-item-grid">
                <div className="agenda-form-row">
                  <label className="agenda-label">Kind</label>
                  <select
                    className="input"
                    value={selectedItem.kind}
                    onChange={(e) =>
                      updateItem(selectedItem.id, { kind: e.target.value as AgendaKind })
                    }
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="agenda-form-row">
                  <label className="agenda-label">Owner</label>
                  <input
                    className="input"
                    value={selectedItem.owner}
                    onChange={(e) => updateItem(selectedItem.id, { owner: e.target.value })}
                  />
                </div>
                <div className="agenda-form-row">
                  <label className="agenda-label">Date / Due / Target</label>
                  <input
                    className="input"
                    type="date"
                    value={selectedItem.dueDate ?? ''}
                    onChange={(e) => updateItem(selectedItem.id, { dueDate: e.target.value })}
                  />
                </div>
                <div className="agenda-form-row">
                  <label className="agenda-label">Status</label>
                  <input
                    className="input"
                    value={selectedItem.status ?? ''}
                    onChange={(e) => updateItem(selectedItem.id, { status: e.target.value })}
                  />
                </div>
              </div>

              <div className="agenda-form-row">
                <label className="agenda-label">Title</label>
                <input
                  className="input agenda-full"
                  value={selectedItem.title}
                  onChange={(e) => updateItem(selectedItem.id, { title: e.target.value })}
                />
              </div>

              <div className="agenda-form-row">
                <label className="agenda-label">DoD</label>
                <textarea
                  className="input agenda-textarea"
                  value={selectedItem.dod ?? ''}
                  onChange={(e) => updateItem(selectedItem.id, { dod: e.target.value })}
                />
              </div>

              <div className="agenda-form-row">
                <label className="agenda-label">Details (Internal — no PII)</label>
                <textarea
                  className="input agenda-textarea"
                  value={selectedItem.details ?? ''}
                  onChange={(e) => updateItem(selectedItem.id, { details: e.target.value })}
                />
              </div>

              <div className="agenda-form-grid">
                <div className="agenda-form-row agenda-check">
                  <label className="agenda-label">Public</label>
                  <label className="agenda-checkline">
                    <input
                      type="checkbox"
                      checked={selectedItem.isPublic}
                      onChange={(e) => updateItem(selectedItem.id, { isPublic: e.target.checked })}
                    />
                    <span>Visible in public view</span>
                  </label>
                </div>
                <div className="agenda-form-row">
                  <label className="agenda-label">Public summary (safe)</label>
                  <input
                    className="input"
                    value={selectedItem.publicSummary ?? ''}
                    onChange={(e) => updateItem(selectedItem.id, { publicSummary: e.target.value })}
                  />
                </div>
              </div>

              <details className="agenda-details">
                <summary>Compliance + advanced fields</summary>
                <div className="agenda-advanced">
                  <div className="agenda-form-grid">
                    <div className="agenda-form-row agenda-check">
                      <label className="agenda-label">OML</label>
                      <label className="agenda-checkline">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedItem.oml)}
                          onChange={(e) => updateItem(selectedItem.id, { oml: e.target.checked })}
                        />
                        <span>Flagged</span>
                      </label>
                    </div>
                    <div className="agenda-form-row agenda-check">
                      <label className="agenda-label">PRR</label>
                      <label className="agenda-checkline">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedItem.prr)}
                          onChange={(e) => updateItem(selectedItem.id, { prr: e.target.checked })}
                        />
                        <span>Flagged</span>
                      </label>
                    </div>
                  </div>

                  <div className="agenda-form-grid">
                    <div className="agenda-form-row">
                      <label className="agenda-label">Retention tag</label>
                      <input
                        className="input"
                        value={selectedItem.retentionTag ?? ''}
                        onChange={(e) =>
                          updateItem(selectedItem.id, { retentionTag: e.target.value })
                        }
                      />
                    </div>
                    <div className="agenda-form-row">
                      <label className="agenda-label">Impacted depts</label>
                      <input
                        className="input"
                        value={selectedItem.impactedDepts ?? ''}
                        onChange={(e) =>
                          updateItem(selectedItem.id, { impactedDepts: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </details>

              <div className="agenda-views">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>This Week</h2>
                      <p>Mon–Sun actions due this week.</p>
                    </div>
                  </div>
                  <ul className="agenda-list">
                    {thisWeekActions.length === 0 ? (
                      <li className="case-meta">No action items due this week.</li>
                    ) : (
                      thisWeekActions.slice(0, 8).map((it) => (
                        <li key={it.id}>
                          <span className="case-id">{it.id}</span> {it.title}{' '}
                          <span className="case-meta">
                            ({it.owner} • {it.dueDate})
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Next 10 Days</h2>
                      <p>Actions due soon.</p>
                    </div>
                  </div>
                  <ul className="agenda-list">
                    {nextTenDaysActions.length === 0 ? (
                      <li className="case-meta">No action items due in the next 10 days.</li>
                    ) : (
                      nextTenDaysActions.slice(0, 8).map((it) => (
                        <li key={it.id}>
                          <span className="case-id">{it.id}</span> {it.title}{' '}
                          <span className="case-meta">
                            ({it.dueDate} • {it.status ?? '—'})
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              <div className="panel" style={{ marginTop: 18 }}>
                <div className="panel-header">
                  <div>
                    <h2>Registers (views)</h2>
                    <p>These are derived views of the same intake.</p>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="cases-table agenda-table">
                    <thead>
                      <tr>
                        <th>Action ID</th>
                        <th>Task</th>
                        <th>DoD</th>
                        <th>Owner</th>
                        <th>Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actionItems.map((it) => (
                        <tr key={it.id} onClick={() => setSelectedId(it.id)}>
                          <td className="case-id">{it.id}</td>
                          <td className="case-name">{it.title}</td>
                          <td className="case-meta">{it.dod ?? '—'}</td>
                          <td>{it.owner || '—'}</td>
                          <td>{it.dueDate || '—'}</td>
                          <td>
                            <StatusPill status={it.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap" style={{ marginTop: 18 }}>
                  <table className="cases-table agenda-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Owner</th>
                        <th>Impacted</th>
                        <th>OML/PRR</th>
                        <th>Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decisionItems.map((it) => (
                        <tr key={it.id} onClick={() => setSelectedId(it.id)}>
                          <td className="case-id">{it.id}</td>
                          <td>{it.dueDate || '—'}</td>
                          <td className="case-name">{it.title}</td>
                          <td>{it.owner || '—'}</td>
                          <td className="case-meta">{it.impactedDepts ?? '—'}</td>
                          <td className="case-meta">
                            {(it.oml ? 'OML‑Y' : 'OML‑N') + ' • ' + (it.prr ? 'PRR‑Y' : 'PRR‑N')}
                          </td>
                          <td className="case-meta">{it.retentionTag ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap" style={{ marginTop: 18 }}>
                  <table className="cases-table agenda-table">
                    <thead>
                      <tr>
                        <th>Risk ID</th>
                        <th>Description</th>
                        <th>Likelihood</th>
                        <th>Impact</th>
                        <th>Mitigation</th>
                        <th>Owner</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskItems.map((it) => (
                        <tr key={it.id} onClick={() => setSelectedId(it.id)}>
                          <td className="case-id">{it.id}</td>
                          <td className="case-name">{it.title}</td>
                          <td>{it.likelihood ?? '—'}</td>
                          <td>{it.impact ?? '—'}</td>
                          <td className="case-meta">{it.mitigation ?? '—'}</td>
                          <td>{it.owner || '—'}</td>
                          <td>
                            <StatusPill status={it.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-wrap" style={{ marginTop: 18 }}>
                  <table className="cases-table agenda-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Module</th>
                        <th>Target</th>
                        <th>Compliance</th>
                        <th>Funding</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectItems.map((it) => (
                        <tr key={it.id} onClick={() => setSelectedId(it.id)}>
                          <td className="case-name">
                            <span className="case-id">{it.id}</span> {it.title}
                          </td>
                          <td>{it.module ?? '—'}</td>
                          <td>{it.dueDate ?? '—'}</td>
                          <td className="case-meta">{it.compliance ?? '—'}</td>
                          <td className="case-meta">{it.funding ?? '—'}</td>
                          <td>
                            <StatusPill status={it.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {redFlags.length > 0 ? (
                  <div className="panel" style={{ marginTop: 18 }}>
                    <div className="panel-header">
                      <div>
                        <h2>Red Flags / Watch List</h2>
                        <p>High impact/likelihood or blocked items.</p>
                      </div>
                    </div>
                    <ul className="agenda-list">
                      {redFlags.map((it) => (
                        <li key={it.id}>
                          <span className="case-id">{it.id}</span> {it.title}{' '}
                          <span className="case-meta">
                            ({it.likelihood ?? '—'}/{it.impact ?? '—'} • {it.status ?? '—'})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="case-meta">Select an intake item to view/edit.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Compliance + guardrails (MA)</h2>
            <p>Keep this agenda lawful, findable, and safe for staff and residents.</p>
          </div>
        </div>
        <ul className="agenda-list">
          <li>
            <strong>Open Meeting Law (M.G.L. c.30A):</strong> If a quorum/public body is implicated, ensure agendas,
            notices, minutes, and recordings follow statute and AG guidance.
          </li>
          <li>
            <strong>Public Records (M.G.L. c.66 §10):</strong> Structure outputs so they’re retrievable; apply retention
            tags; keep decision metadata minimal and consistent.
          </li>
          <li>
            <strong>Data security (201 CMR 17.00):</strong> No PII in this workspace. Link to secure systems for
            sensitive records.
          </li>
          <li>
            <strong>Accessibility (WCAG 2.1 AA):</strong> Any public artifacts should be plain-language, structured, and
            accessible.
          </li>
          <li>
            <strong>No shadow systems:</strong> Treat this as the single place for capture; route execution and records
            to the town’s systems of record.
          </li>
        </ul>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>IP notice</h2>
            <p>High-level only.</p>
          </div>
        </div>
        <p className="case-meta">
          This agenda reflects PublicLogic™ methods and may reference VAULT™/ARCHIEVE™ at a high level only. Mechanics
          and logic are proprietary and intentionally omitted.
        </p>
      </section>
    </div>
  )
}
