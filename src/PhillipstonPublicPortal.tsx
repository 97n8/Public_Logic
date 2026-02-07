import React from 'react'

const portalTimeline = [
  { title: 'Applications open', date: 'Jan 15, 2026' },
  { title: 'Deadline to apply', date: 'Mar 1, 2026' },
  { title: 'Lottery and placement', date: 'Mar 6, 2026' },
  { title: 'Decisions sent', date: 'Mar 8, 2026' },
  { title: 'Accept seat by', date: 'Mar 18, 2026' },
]

const portalRequirements = [
  'Proof of residency (utility bill or lease within 60 days).',
  'Birth certificate or equivalent record.',
  'Immunization record from current provider.',
  'Parent or guardian photo ID.',
]

const portalFaq = [
  {
    q: 'Who can apply?',
    a: 'Families seeking K-6 choice seats in Phillipston and approved partner districts.',
  },
  {
    q: 'How are seats assigned?',
    a: 'Oversubscribed grades use a public lottery and priority rules.',
  },
  {
    q: 'How will I receive a decision?',
    a: 'Decisions are sent by email and postal letter after the lottery.',
  },
]

export default function PhillipstonPublicPortal() {
  return (
    <div className="public-portal">
      <section className="hero public-hero">
        <div className="hero-copy" data-animate="rise">
          <div className="hero-kicker">Phillipston Public Portal</div>
          <h1>Open Enrollment 2026</h1>
          <p className="hero-subtitle">
            Apply for K-6 choice seats, track your application, and receive decisions from a single place.
          </p>
          <div className="hero-actions">
            <button className="btn primary">Start an application</button>
            <button className="btn ghost">Check your status</button>
            <button className="btn ghost">Download paper form</button>
          </div>
        </div>
        <div className="hero-panel" data-animate="rise">
          <div className="hero-panel-title">Key dates</div>
          {portalTimeline.map((item) => (
            <div key={item.title} className="hero-panel-row">
              <span>{item.title}</span>
              <strong>{item.date}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="public-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>How it works</h2>
              <p>Follow these steps to complete your application.</p>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div>
                <div className="step-title">Confirm eligibility</div>
                <div className="step-text">Review grade level and residency requirements.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div>
                <div className="step-title">Gather documents</div>
                <div className="step-text">Prepare proof of residency and student records.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div>
                <div className="step-title">Submit the application</div>
                <div className="step-text">Online submissions receive instant confirmation.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div>
                <div className="step-title">Watch for decisions</div>
                <div className="step-text">You will receive email and mail notices.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Required documents</h2>
              <p>Upload these items to avoid delays.</p>
            </div>
            <button className="btn ghost">Download checklist</button>
          </div>
          <div className="requirements">
            {portalRequirements.map((item) => (
              <div key={item} className="requirement-card">
                <div className="requirement-title">Document</div>
                <div className="requirement-detail">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel public-faq">
        <div className="panel-header">
          <div>
            <h2>Questions and support</h2>
            <p>We are here to help with translations, accessibility, and scheduling.</p>
          </div>
          <button className="btn ghost">Contact the enrollment team</button>
        </div>
        <div className="faq">
          {portalFaq.map((item) => (
            <div key={item.q} className="faq-item">
              <div className="faq-question">{item.q}</div>
              <div className="faq-answer">{item.a}</div>
            </div>
          ))}
        </div>
        <div className="contact-strip">
          <div>
            <strong>Email</strong> enrollment@phillipston.gov
          </div>
          <div>
            <strong>Phone</strong> (978) 555-0142
          </div>
          <div>
            <strong>Office hours</strong> Mon-Thu 8:30 AM - 4:30 PM
          </div>
        </div>
      </section>
    </div>
  )
}
