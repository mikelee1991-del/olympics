import { useState } from 'react'
import Planner from './components/Planner'
import Standings from './components/Standings'
import './App.css'

type Tab = 'planner' | 'standings'

export default function App() {
  const [tab, setTab] = useState<Tab>('planner')

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#top">
          Olympics
        </a>
        <nav className="nav" aria-label="Primary">
          <button
            type="button"
            className={tab === 'planner' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('planner')}
          >
            Schedule planner
          </button>
          <button
            type="button"
            className={tab === 'standings' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('standings')}
          >
            Medal demo
          </button>
        </nav>
      </header>

      {tab === 'planner' ? <Planner /> : <Standings />}
    </div>
  )
}
