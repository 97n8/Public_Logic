
import React, { useState } from 'react'
import LogicvilleGovernanceOS from './LogicvilleGovernanceOS'
import PublicPortal from './PublicPortal'

export default function App() {
  const [view, setView] = useState<'staff' | 'public'>('staff')

  return (
    <>
      {view === 'staff' ? <LogicvilleGovernanceOS /> : <PublicPortal />}
    </>
  )
}
