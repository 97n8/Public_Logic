import { useCallback, useEffect, useMemo, useState } from 'react'

export type AgendaKind = 'Action' | 'Decision' | 'Risk' | 'Project' | 'Note'

export type RiskLevel = 'Low' | 'Med' | 'High'

export type AgendaItem = {
  id: string
  kind: AgendaKind
  title: string
  owner: string
  dueDate?: string
  status?: string
  dod?: string
  details?: string
  isPublic: boolean
  publicSummary?: string

  oml?: boolean
  prr?: boolean
  retentionTag?: string
  impactedDepts?: string

  likelihood?: RiskLevel
  impact?: RiskLevel
  mitigation?: string

  module?: string
  funding?: string
  compliance?: string
  links?: string

  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'publiclogic.logicville.living_agenda.v1'

const ID_BASE: Record<AgendaKind, number> = {
  Action: 101,
  Decision: 101,
  Risk: 201,
  Project: 301,
  Note: 401,
}

const ID_PREFIX: Record<AgendaKind, string> = {
  Action: 'A',
  Decision: 'D',
  Risk: 'R',
  Project: 'P',
  Note: 'N',
}

function nowIso() {
  return new Date().toISOString()
}

function normalizeText(v: unknown) {
  return String(v ?? '').trim()
}

function parseIdNumber(id: string) {
  const m = id.match(/^[A-Z]-([0-9]+)$/)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

function nextId(kind: AgendaKind, items: AgendaItem[]) {
  const prefix = ID_PREFIX[kind]
  const base = ID_BASE[kind]
  const max = items
    .filter((it) => it.id.startsWith(`${prefix}-`))
    .map((it) => parseIdNumber(it.id))
    .filter((n): n is number => n !== null)
    .reduce((acc, n) => Math.max(acc, n), base - 1)
  return `${prefix}-${max + 1}`
}

function asKind(v: unknown): AgendaKind {
  const x = normalizeText(v).toLowerCase()
  if (x === 'action') return 'Action'
  if (x === 'decision') return 'Decision'
  if (x === 'risk') return 'Risk'
  if (x === 'project') return 'Project'
  return 'Note'
}

function asRiskLevel(v: unknown): RiskLevel | undefined {
  const x = normalizeText(v).toLowerCase()
  if (x === 'low') return 'Low'
  if (x === 'med' || x === 'medium') return 'Med'
  if (x === 'high') return 'High'
  return undefined
}

function asBoolean(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  const x = normalizeText(v).toLowerCase()
  return ['true', '1', 'yes', 'y'].includes(x)
}

function coerceItem(raw: any): AgendaItem | null {
  const id = normalizeText(raw?.id)
  if (!id) return null

  const kind = asKind(raw?.kind)
  const title = normalizeText(raw?.title)
  if (!title) return null

  const createdAt = normalizeText(raw?.createdAt) || nowIso()
  const updatedAt = normalizeText(raw?.updatedAt) || createdAt

  return {
    id,
    kind,
    title,
    owner: normalizeText(raw?.owner),
    dueDate: normalizeText(raw?.dueDate) || undefined,
    status: normalizeText(raw?.status) || undefined,
    dod: normalizeText(raw?.dod) || undefined,
    details: normalizeText(raw?.details) || undefined,
    isPublic: asBoolean(raw?.isPublic),
    publicSummary: normalizeText(raw?.publicSummary) || undefined,
    oml: raw?.oml === undefined ? undefined : asBoolean(raw?.oml),
    prr: raw?.prr === undefined ? undefined : asBoolean(raw?.prr),
    retentionTag: normalizeText(raw?.retentionTag) || undefined,
    impactedDepts: normalizeText(raw?.impactedDepts) || undefined,
    likelihood: asRiskLevel(raw?.likelihood),
    impact: asRiskLevel(raw?.impact),
    mitigation: normalizeText(raw?.mitigation) || undefined,
    module: normalizeText(raw?.module) || undefined,
    funding: normalizeText(raw?.funding) || undefined,
    compliance: normalizeText(raw?.compliance) || undefined,
    links: normalizeText(raw?.links) || undefined,
    createdAt,
    updatedAt,
  }
}

export const LOGICVILLE_SEED_ITEMS: AgendaItem[] = [
  {
    id: 'A-101',
    kind: 'Action',
    title: 'Draft VAULT high‑level map (PRR + Service Tickets)',
    dod: 'Single-page map reviewed by both; links added',
    owner: 'Nate',
    dueDate: '2026-02-07',
    status: 'In Progress',
    isPublic: true,
    publicSummary: 'High-level map in progress; publish a public-safe version after review.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'A-102',
    kind: 'Action',
    title: 'PublicInsight categories + scoring v0.9',
    dod: 'Categories + rubric in 1‑pager; staff read‑through',
    owner: 'Allie',
    dueDate: '2026-02-07',
    status: 'In Progress',
    isPublic: true,
    publicSummary: 'Draft categories and scoring rubric; finalize language with staff.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'A-103',
    kind: 'Action',
    title: 'Board packet insert outline',
    dod: '3 bullets + 1 visual drafted',
    owner: 'Nate',
    dueDate: '2026-02-10',
    status: 'Not Started',
    isPublic: false,
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'A-104',
    kind: 'Action',
    title: 'Staff FAQ (6 Qs)',
    dod: 'Plain-language answers; WCAG checked',
    owner: 'Allie',
    dueDate: '2026-02-11',
    status: 'Not Started',
    isPublic: false,
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'A-105',
    kind: 'Action',
    title: 'Universal SOP template + 2 examples',
    dod: 'Template approved; two filled examples',
    owner: 'Both',
    dueDate: '2026-02-12',
    status: 'Not Started',
    isPublic: true,
    publicSummary: 'Publish a short SOP template and two examples (public-safe) after review.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'D-101',
    kind: 'Decision',
    title: 'Day One narrative',
    dueDate: '2026-02-04',
    status: 'Decided',
    owner: 'Nate',
    prr: true,
    retentionTag: 'Schedule: Municipal Admin',
    impactedDepts: 'Admin, All',
    isPublic: true,
    publicSummary: 'Adopt lanes + outcomes framing for this pilot.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'D-102',
    kind: 'Decision',
    title: 'Founders agenda default cadence',
    dueDate: '2026-02-04',
    status: 'Decided',
    owner: 'Allie',
    prr: false,
    impactedDepts: 'Admin',
    isPublic: true,
    publicSummary: 'Adopt 90‑minute agenda as default when needed; weekly 30–45 min check-in remains primary.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'R-201',
    kind: 'Risk',
    title: 'Holiday / meeting-cycle compression cuts testing time',
    status: 'Open',
    owner: 'Allie',
    likelihood: 'Med',
    impact: 'High',
    mitigation: 'Pre-schedule blocks; use async scripts; keep scope tight.',
    isPublic: false,
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'R-202',
    kind: 'Risk',
    title: 'Vendor SSO slip',
    status: 'Open',
    owner: 'Nate',
    likelihood: 'Med',
    impact: 'High',
    mitigation: 'Interim local auth; date gate; escalate early.',
    isPublic: false,
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'P-301',
    kind: 'Project',
    title: 'LogicvilleCONNECT expansion',
    module: 'APEX/AGENDA',
    status: 'Active',
    owner: 'Nate',
    dueDate: '2026-05-01',
    compliance: 'OML posting, WCAG, PRR',
    funding: 'Community Compact',
    isPublic: true,
    publicSummary: 'Expand resident-facing services with clear postings and accessible artifacts.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'P-302',
    kind: 'Project',
    title: 'LogicvilleCLERK',
    module: 'CLERK',
    status: 'Active',
    owner: 'Allie',
    dueDate: '2026-05-01',
    compliance: 'M.G.L. c.66 §10, retention',
    funding: 'Shared Services',
    isPublic: true,
    publicSummary: 'Improve intake and public records readiness with clear routing and retention tags.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'P-303',
    kind: 'Project',
    title: 'LogicvilleFIX',
    module: 'FIX',
    status: 'Active',
    owner: 'Nate',
    dueDate: '2026-05-01',
    compliance: 'ADA/WCAG; 201 CMR 17.00',
    funding: 'ARPA/Local',
    isPublic: true,
    publicSummary: 'Service request UX improvements aligned to compliance and data security guardrails.',
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z',
  },
]

function loadFromStorage(): AgendaItem[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const items = parsed.map(coerceItem).filter((x): x is AgendaItem => x !== null)
    return items.length > 0 ? items : null
  } catch {
    return null
  }
}

function saveToStorage(items: AgendaItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useLogicvilleAgendaStore() {
  const seed = useMemo(() => LOGICVILLE_SEED_ITEMS, [])
  const [items, setItems] = useState<AgendaItem[]>(() => loadFromStorage() ?? seed)

  useEffect(() => {
    saveToStorage(items)
  }, [items])

  const addItem = useCallback(
    (draft: Omit<AgendaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const ts = nowIso()
      setItems((prev) => [
        ...prev,
        {
          ...draft,
          id: nextId(draft.kind, prev),
          createdAt: ts,
          updatedAt: ts,
        },
      ])
    },
    []
  )

  const updateItem = useCallback((id: string, patch: Partial<AgendaItem>) => {
    const ts = nowIso()
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch, updatedAt: ts } : it))
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const reset = useCallback(() => {
    setItems(seed)
  }, [seed])

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    reset,
  }
}

