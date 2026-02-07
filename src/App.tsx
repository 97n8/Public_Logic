import React, { useState } from 'react'
import LogicvilleGovernanceOS from './LogicvilleGovernanceOS'
import PublicPortal from './PublicPortal'

export default function App() {
  const [view, setView] = useState<'internal' | 'public'>('internal')

  return (
    <div className="app-shell">
      <header className="app-top">
        <div className="brand-block">
          <div className="brand-mark">PublicLogic</div>
          <div className="brand-sub">Logicville, MA — Living Agenda</div>
        </div>
        <nav className="view-toggle">
          <button
            className={`toggle-btn ${view === 'internal' ? 'active' : ''}`}
            onClick={() => setView('internal')}
          >
            Internal Agenda
          </button>
          <button
            className={`toggle-btn ${view === 'public' ? 'active' : ''}`}
            onClick={() => setView('public')}
          >
            Public View
          </button>
        </nav>
      </header>
      {view === 'internal' ? <LogicvilleGovernanceOS /> : <PublicPortal />}
    </div>
  )
}
