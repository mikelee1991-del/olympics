import { useState } from 'react'
import CalendarView from './components/CalendarView'
import SessionsView from './components/SessionsView'
import MapView from './components/MapView'
import ConflictsView from './components/ConflictsView'
import { usePlan } from './hooks/usePlan'
import './App.css'

type Tab = 'calendar' | 'sessions' | 'map' | 'conflicts'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'map', label: 'Map' },
  { id: 'conflicts', label: 'Conflicts' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('calendar')
  const plan = usePlan()

  return (
    <div className="page" data-testid="planner">
      <header className="topbar">
        <a className="brand" href="#top">
          LA28
        </a>
        <nav className="nav" aria-label="Primary">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'calendar' ? (
        <CalendarView
          plan={plan}
          onOpenSessions={() => setTab('sessions')}
          onOpenMap={() => setTab('map')}
        />
      ) : null}
      {tab === 'sessions' ? (
        <SessionsView plan={plan} onOpenMap={() => setTab('map')} />
      ) : null}
      {tab === 'map' ? <MapView plan={plan} /> : null}
      {tab === 'conflicts' ? (
        <ConflictsView
          plan={plan}
          onOpenSessions={() => setTab('sessions')}
        />
      ) : null}
    </div>
  )
}
