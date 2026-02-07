import React, { useMemo, useState } from 'react'

type CaseStatus =
  | 'Intake'
  | 'Verification'
  | 'Lottery'
  | 'Offered'
  | 'Waitlist'
  | 'Appeal'
  | 'Enrolled'
  | 'Declined'

type Eligibility = 'Eligible' | 'Pending' | 'Ineligible'

type DocumentStatus = 'Received' | 'Missing' | 'Invalid' | 'Pending'

type TaskStatus = 'Open' | 'In review' | 'Done' | 'Blocked'

type CommunicationChannel = 'Email' | 'Letter' | 'Phone' | 'Portal'

type CaseDocument = {
  name: string
  status: DocumentStatus
}

type CaseTask = {
  title: string
  due: string
  status: TaskStatus
  owner: string
}

type CaseCommunication = {
  channel: CommunicationChannel
  subject: string
  date: string
  status: 'Sent' | 'Scheduled' | 'Draft'
}

type CaseActivity = {
  date: string
  detail: string
}

type CaseFile = {
  id: string
  applicant: string
  guardian: string
  grade: string
  submittedAt: string
  lastTouch: string
  status: CaseStatus
  assignedTo: string
  eligibility: Eligibility
  residency: 'In-district' | 'Out-of-district' | 'Pending'
  siblingPriority: boolean
  priorityScore: number
  slaHours: number
  schoolChoices: string[]
  documents: CaseDocument[]
  tasks: CaseTask[]
  communications: CaseCommunication[]
  activity: CaseActivity[]
  notes: string
}

const openEnrollmentPeriod = {
  year: 2026,
  title: 'Phillipston Open Enrollment Case Space',
  window: 'Jan 15 - Mar 1, 2026',
  program: 'K-6 Choice Seats',
  seats: 24,
  applicationCap: 120,
  nextDeadline: 'Verification complete by Feb 12, 2026',
  decisionRelease: 'Decisions sent Mar 8, 2026',
  acceptanceDeadline: 'Seat acceptance due Mar 18, 2026',
}

const timeline = [
  { milestone: 'Application window opens', date: 'Jan 15, 2026' },
  { milestone: 'Paper deadline', date: 'Mar 1, 2026' },
  { milestone: 'Lottery and placement', date: 'Mar 6, 2026' },
  { milestone: 'Decision notices sent', date: 'Mar 8, 2026' },
  { milestone: 'Acceptance deadline', date: 'Mar 18, 2026' },
  { milestone: 'Appeals close', date: 'Apr 5, 2026' },
]

const complianceChecklist = [
  'Publish public notice and application window',
  'Verify residency and age for all applicants',
  'Run lottery for oversubscribed grades',
  'Send decisions within 3 business days of lottery',
  'Maintain waitlist order and publish acceptance rules',
  'Archive decision letters and audit log',
]

const intakeRequirements = [
  { name: 'Proof of residency', detail: 'Utility bill or lease within 60 days' },
  { name: 'Birth certificate', detail: 'State or hospital record' },
  { name: 'Immunization record', detail: 'Current school nurse form' },
  { name: 'Parent ID', detail: 'Driver license or state ID' },
]

const statusFilters = [
  'All',
  'Intake',
  'Verification',
  'Lottery',
  'Offered',
  'Waitlist',
  'Appeal',
  'Enrolled',
  'Declined',
] as const

type StatusFilter = (typeof statusFilters)[number]

const caseFiles: CaseFile[] = [
  {
    id: 'POE-26017',
    applicant: 'Jaden R.',
    guardian: 'Avery Rodriguez',
    grade: 'K',
    submittedAt: 'Jan 22, 2026',
    lastTouch: 'Feb 2, 2026',
    status: 'Verification',
    assignedTo: 'R. Patel',
    eligibility: 'Pending',
    residency: 'In-district',
    siblingPriority: true,
    priorityScore: 84,
    slaHours: 36,
    schoolChoices: ['Phillipston Elementary', 'Athol Royalston', 'Winchendon'],
    documents: [
      { name: 'Proof of residency', status: 'Pending' },
      { name: 'Birth certificate', status: 'Received' },
      { name: 'Immunization record', status: 'Received' },
      { name: 'Parent ID', status: 'Received' },
    ],
    tasks: [
      { title: 'Verify residency', due: 'Feb 6, 2026', status: 'Open', owner: 'R. Patel' },
      { title: 'Confirm sibling priority', due: 'Feb 7, 2026', status: 'In review', owner: 'C. Kim' },
      { title: 'Queue for lottery', due: 'Mar 6, 2026', status: 'Blocked', owner: 'System' },
    ],
    communications: [
      { channel: 'Email', subject: 'Missing residency doc reminder', date: 'Feb 2, 2026', status: 'Sent' },
      { channel: 'Portal', subject: 'Application submitted', date: 'Jan 22, 2026', status: 'Sent' },
    ],
    activity: [
      { date: 'Feb 2, 2026', detail: 'Residency document request sent.' },
      { date: 'Jan 22, 2026', detail: 'Application created by guardian.' },
    ],
    notes:
      'Guardian prefers email updates. Sibling currently enrolled in grade 3. Awaiting updated utility bill.',
  },
  {
    id: 'POE-26023',
    applicant: 'Elise M.',
    guardian: 'Samir Malik',
    grade: '3',
    submittedAt: 'Jan 25, 2026',
    lastTouch: 'Feb 3, 2026',
    status: 'Lottery',
    assignedTo: 'K. Brooks',
    eligibility: 'Eligible',
    residency: 'Out-of-district',
    siblingPriority: false,
    priorityScore: 61,
    slaHours: 18,
    schoolChoices: ['Phillipston Elementary', 'Petersham', 'Orange'],
    documents: [
      { name: 'Proof of residency', status: 'Received' },
      { name: 'Birth certificate', status: 'Received' },
      { name: 'Immunization record', status: 'Received' },
      { name: 'Parent ID', status: 'Received' },
    ],
    tasks: [
      { title: 'Confirm out-of-district seat', due: 'Feb 10, 2026', status: 'Done', owner: 'K. Brooks' },
      { title: 'Notify about lottery date', due: 'Feb 12, 2026', status: 'Done', owner: 'System' },
    ],
    communications: [
      { channel: 'Letter', subject: 'Lottery schedule notice', date: 'Feb 3, 2026', status: 'Sent' },
      { channel: 'Portal', subject: 'Eligibility verified', date: 'Jan 30, 2026', status: 'Sent' },
    ],
    activity: [
      { date: 'Feb 3, 2026', detail: 'Lottery notice sent by mail.' },
      { date: 'Jan 30, 2026', detail: 'Eligibility verified and cleared.' },
    ],
    notes: 'Family prefers mail for all official notices.',
  },
  {
    id: 'POE-26041',
    applicant: 'Mika T.',
    guardian: 'Jordan Tran',
    grade: '5',
    submittedAt: 'Feb 1, 2026',
    lastTouch: 'Feb 4, 2026',
    status: 'Intake',
    assignedTo: 'D. Lewis',
    eligibility: 'Pending',
    residency: 'Pending',
    siblingPriority: false,
    priorityScore: 52,
    slaHours: 10,
    schoolChoices: ['Phillipston Elementary', 'Athol Royalston'],
    documents: [
      { name: 'Proof of residency', status: 'Missing' },
      { name: 'Birth certificate', status: 'Pending' },
      { name: 'Immunization record', status: 'Pending' },
      { name: 'Parent ID', status: 'Pending' },
    ],
    tasks: [
      { title: 'Collect residency packet', due: 'Feb 7, 2026', status: 'Open', owner: 'D. Lewis' },
      { title: 'Schedule intake call', due: 'Feb 6, 2026', status: 'Open', owner: 'D. Lewis' },
    ],
    communications: [
      { channel: 'Email', subject: 'Welcome and intake checklist', date: 'Feb 4, 2026', status: 'Sent' },
    ],
    activity: [
      { date: 'Feb 4, 2026', detail: 'Case assigned and intake email sent.' },
      { date: 'Feb 1, 2026', detail: 'Application submitted online.' },
    ],
    notes: 'Awaiting intake call to confirm grade placement.',
  },
  {
    id: 'POE-26057',
    applicant: 'Noah S.',
    guardian: 'Morgan Shah',
    grade: '1',
    submittedAt: 'Jan 18, 2026',
    lastTouch: 'Feb 1, 2026',
    status: 'Offered',
    assignedTo: 'A. Doyle',
    eligibility: 'Eligible',
    residency: 'In-district',
    siblingPriority: true,
    priorityScore: 92,
    slaHours: 44,
    schoolChoices: ['Phillipston Elementary'],
    documents: [
      { name: 'Proof of residency', status: 'Received' },
      { name: 'Birth certificate', status: 'Received' },
      { name: 'Immunization record', status: 'Received' },
      { name: 'Parent ID', status: 'Received' },
    ],
    tasks: [
      { title: 'Send offer letter', due: 'Feb 2, 2026', status: 'Done', owner: 'System' },
      { title: 'Confirm seat acceptance', due: 'Feb 12, 2026', status: 'Open', owner: 'A. Doyle' },
    ],
    communications: [
      { channel: 'Letter', subject: 'Seat offer', date: 'Feb 1, 2026', status: 'Sent' },
      { channel: 'Email', subject: 'Offer and acceptance steps', date: 'Feb 1, 2026', status: 'Sent' },
    ],
    activity: [
      { date: 'Feb 1, 2026', detail: 'Seat offer delivered.' },
      { date: 'Jan 20, 2026', detail: 'Eligibility verified.' },
    ],
    notes: 'Awaiting acceptance and transportation form.',
  },
]

const statusStyles: Record<CaseStatus, string> = {
  Intake: 'status-intake',
  Verification: 'status-verification',
  Lottery: 'status-lottery',
  Offered: 'status-offered',
  Waitlist: 'status-waitlist',
  Appeal: 'status-appeal',
  Enrolled: 'status-enrolled',
  Declined: 'status-declined',
}

export default function PhillipstonOpenEnrollment() {
  const [selectedId, setSelectedId] = useState(caseFiles[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const filteredCases = useMemo(() => {
    return caseFiles.filter((caseFile) => {
      const matchesQuery =
        query.trim().length === 0 ||
        caseFile.id.toLowerCase().includes(query.toLowerCase()) ||
        caseFile.applicant.toLowerCase().includes(query.toLowerCase()) ||
        caseFile.guardian.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || caseFile.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  const selectedCase = caseFiles.find((caseFile) => caseFile.id === selectedId) ?? filteredCases[0]

  const totalCases = caseFiles.length
  const eligibleCount = caseFiles.filter((caseFile) => caseFile.eligibility === 'Eligible').length
  const pendingCount = caseFiles.filter((caseFile) => caseFile.eligibility === 'Pending').length
  const offeredCount = caseFiles.filter((caseFile) => caseFile.status === 'Offered').length
  const waitlistCount = caseFiles.filter((caseFile) => caseFile.status === 'Waitlist').length
  const slaRisk = caseFiles.filter((caseFile) => caseFile.slaHours <= 24).length
  const missingDocs = caseFiles.filter((caseFile) =>
    caseFile.documents.some((doc) => doc.status === 'Missing' || doc.status === 'Pending')
  ).length

  return (
    <div className="case-space">
      <section className="hero">
        <div className="hero-copy" data-animate="rise">
          <div className="hero-kicker">Town of Phillipston</div>
          <h1>{openEnrollmentPeriod.title}</h1>
          <p className="hero-subtitle">
            Manage intake, verification, lottery, and decisions with a single workspace. Keep every case on
            deadline and every decision auditable.
          </p>
          <div className="hero-meta">
            <span className="tag">Window: {openEnrollmentPeriod.window}</span>
            <span className="tag">Program: {openEnrollmentPeriod.program}</span>
            <span className="tag">Seats: {openEnrollmentPeriod.seats}</span>
          </div>
          <div className="hero-actions">
            <button className="btn primary">New Case</button>
            <button className="btn ghost">Generate Notices</button>
            <button className="btn ghost">Export Audit Log</button>
          </div>
        </div>
        <div className="hero-panel" data-animate="rise">
          <div className="hero-panel-title">Next critical deadline</div>
          <div className="hero-panel-deadline">{openEnrollmentPeriod.nextDeadline}</div>
          <div className="hero-panel-row">
            <span>Decision release</span>
            <strong>{openEnrollmentPeriod.decisionRelease}</strong>
          </div>
          <div className="hero-panel-row">
            <span>Acceptance deadline</span>
            <strong>{openEnrollmentPeriod.acceptanceDeadline}</strong>
          </div>
          <div className="hero-panel-row">
            <span>Application cap</span>
            <strong>{openEnrollmentPeriod.applicationCap}</strong>
          </div>
        </div>
      </section>

      <section className="metrics">
        <div className="card" data-animate="rise">
          <div className="card-label">Total applications</div>
          <div className="card-value">{totalCases}</div>
          <div className="card-meta">{openEnrollmentPeriod.applicationCap} cap</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Eligibility ready</div>
          <div className="card-value">{eligibleCount}</div>
          <div className="card-meta">{pendingCount} pending review</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Seats offered</div>
          <div className="card-value">{offeredCount}</div>
          <div className="card-meta">{waitlistCount} waitlisted</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">SLA watch</div>
          <div className="card-value">{slaRisk}</div>
          <div className="card-meta">cases within 24 hours</div>
        </div>
        <div className="card" data-animate="rise">
          <div className="card-label">Missing documents</div>
          <div className="card-value">{missingDocs}</div>
          <div className="card-meta">ready for outreach</div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel cases">
          <div className="panel-header">
            <div>
              <h2>Active cases</h2>
              <p>Track every application and move it through the workflow.</p>
            </div>
            <div className="panel-controls">
              <input
                className="input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by case id, applicant, or guardian"
              />
              <button className="btn ghost">Bulk Actions</button>
            </div>
          </div>
          <div className="filter-row">
            {statusFilters.map((status) => (
              <button
                key={status}
                className={`chip ${statusFilter === status ? 'chip-active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="table-wrap">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Applicant</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Last touch</th>
                  <th>SLA</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseFile) => (
                  <tr
                    key={caseFile.id}
                    className={caseFile.id === selectedId ? 'active-row' : ''}
                    onClick={() => setSelectedId(caseFile.id)}
                  >
                    <td>
                      <div className="case-id">{caseFile.id}</div>
                      <div className="case-meta">Submitted {caseFile.submittedAt}</div>
                    </td>
                    <td>
                      <div className="case-name">{caseFile.applicant}</div>
                      <div className="case-meta">Guardian: {caseFile.guardian}</div>
                    </td>
                    <td>{caseFile.grade}</td>
                    <td>
                      <span className={`status-pill ${statusStyles[caseFile.status]}`}>
                        {caseFile.status}
                      </span>
                    </td>
                    <td>{caseFile.assignedTo}</td>
                    <td>{caseFile.lastTouch}</td>
                    <td>
                      <span className={caseFile.slaHours <= 24 ? 'sla risk' : 'sla'}>
                        {caseFile.slaHours} hrs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel details">
          {selectedCase ? (
            <>
              <div className="panel-header">
                <div>
                  <h2>Case workspace</h2>
                  <p>{selectedCase.id} | {selectedCase.applicant}</p>
                </div>
                <div className="panel-actions">
                  <button className="btn ghost">Assign</button>
                  <button className="btn primary">Send Update</button>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <div className="detail-title">Applicant details</div>
                  <div className="detail-row"><span>Guardian</span><strong>{selectedCase.guardian}</strong></div>
                  <div className="detail-row"><span>Grade</span><strong>{selectedCase.grade}</strong></div>
                  <div className="detail-row"><span>Residency</span><strong>{selectedCase.residency}</strong></div>
                  <div className="detail-row"><span>Eligibility</span><strong>{selectedCase.eligibility}</strong></div>
                  <div className="detail-row"><span>Priority score</span><strong>{selectedCase.priorityScore}</strong></div>
                  <div className="detail-row"><span>Sibling priority</span><strong>{selectedCase.siblingPriority ? 'Yes' : 'No'}</strong></div>
                </div>

                <div className="detail-card">
                  <div className="detail-title">School choices</div>
                  <div className="choice-list">
                    {selectedCase.schoolChoices.map((choice, index) => (
                      <div key={choice} className="choice-item">
                        <span className="choice-rank">#{index + 1}</span>
                        <span>{choice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="detail-note">Assigned to {selectedCase.assignedTo}</div>
                </div>

                <div className="detail-card">
                  <div className="detail-title">Documents</div>
                  <div className="document-list">
                    {selectedCase.documents.map((doc) => (
                      <div key={doc.name} className="document-item">
                        <span>{doc.name}</span>
                        <span className={`doc-status doc-${doc.status.toLowerCase()}`}>{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-title">Tasks</div>
                  <div className="task-list">
                    {selectedCase.tasks.map((task) => (
                      <div key={task.title} className="task-item">
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-meta">Due {task.due} | Owner {task.owner}</div>
                        </div>
                        <span className={`task-status task-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-card wide">
                  <div className="detail-title">Communications</div>
                  <div className="comm-list">
                    {selectedCase.communications.map((comm) => (
                      <div key={`${comm.subject}-${comm.date}`} className="comm-item">
                        <div>
                          <div className="comm-subject">{comm.subject}</div>
                          <div className="comm-meta">{comm.channel} | {comm.date}</div>
                        </div>
                        <span className="comm-status">{comm.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="detail-card wide">
                  <div className="detail-title">Activity log</div>
                  <div className="activity-list">
                    {selectedCase.activity.map((entry) => (
                      <div key={`${entry.date}-${entry.detail}`} className="activity-item">
                        <span className="activity-date">{entry.date}</span>
                        <span>{entry.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div className="detail-note">Notes: {selectedCase.notes}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">Select a case to view details.</div>
          )}
        </div>
      </section>

      <section className="supporting">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Timeline and compliance</h2>
              <p>Keep statutory steps visible while you manage day-to-day work.</p>
            </div>
            <button className="btn ghost">Open compliance plan</button>
          </div>
          <div className="timeline-grid">
            <div className="timeline">
              {timeline.map((item) => (
                <div key={item.milestone} className="timeline-item">
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-title">{item.milestone}</div>
                </div>
              ))}
            </div>
            <div className="compliance">
              <div className="detail-title">Compliance checklist</div>
              <div className="checklist">
                {complianceChecklist.map((item) => (
                  <div key={item} className="check-item">
                    <span className="check-box" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="detail-note">Audit log exports are stored in the records vault.</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Intake requirements</h2>
              <p>Use consistent checklists so applicants know what is expected.</p>
            </div>
            <button className="btn ghost">Update intake packet</button>
          </div>
          <div className="requirements">
            {intakeRequirements.map((req) => (
              <div key={req.name} className="requirement-card">
                <div className="requirement-title">{req.name}</div>
                <div className="requirement-detail">{req.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
