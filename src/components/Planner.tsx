import { useMemo, useState } from 'react'
import ConflictPanel from './ConflictPanel'
import EventForm from './EventForm'
import VenueMap from './VenueMap'
import { PEOPLE, type PersonId } from '../data/family'
import {
  buildSeedPlan,
  formatDisplayDate,
  PLANNER_STORAGE_KEY,
  type PlannedSession,
  type TicketStatus,
} from '../data/planner'
import { conflictsByPerson, findConflicts } from '../lib/conflicts'
import { VENUE_BY_ID } from '../data/venues'

function loadPlan(): PlannedSession[] {
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY)
    if (!raw) return buildSeedPlan()
    const parsed = JSON.parse(raw) as PlannedSession[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : buildSeedPlan()
  } catch {
    return buildSeedPlan()
  }
}

function savePlan(sessions: PlannedSession[]) {
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(sessions))
}

const TICKET_FILTERS: Array<TicketStatus | 'all'> = ['all', 'have', 'want', 'skip']

export default function Planner() {
  const [sessions, setSessions] = useState<PlannedSession[]>(loadPlan)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [ticketFilter, setTicketFilter] = useState<TicketStatus | 'all'>('all')
  const [personFilter, setPersonFilter] = useState<PersonId | 'all'>('all')
  const [editing, setEditing] = useState<PlannedSession | null | 'new'>(null)
  const [focusVenueId, setFocusVenueId] = useState<string | null>(null)

  const dates = useMemo(
    () => [...new Set(sessions.map((s) => s.date))].sort(),
    [sessions],
  )

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => (selectedDate ? s.date === selectedDate : true))
      .filter((s) => (ticketFilter === 'all' ? true : s.ticketStatus === ticketFilter))
      .filter((s) =>
        personFilter === 'all' ? true : s.attendees.includes(personFilter),
      )
      .sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      )
  }, [sessions, selectedDate, ticketFilter, personFilter])

  const conflicts = useMemo(() => findConflicts(sessions), [sessions])
  const byPerson = useMemo(() => conflictsByPerson(conflicts), [conflicts])

  const counts = useMemo(() => {
    const have = sessions.filter((s) => s.ticketStatus === 'have').length
    const want = sessions.filter((s) => s.ticketStatus === 'want').length
    const skip = sessions.filter((s) => s.ticketStatus === 'skip').length
    return { have, want, skip, conflicts: conflicts.filter((c) => c.type === 'overlap').length }
  }, [sessions, conflicts])

  function updateSessions(next: PlannedSession[]) {
    setSessions(next)
    savePlan(next)
  }

  function upsert(session: PlannedSession) {
    const exists = sessions.some((s) => s.id === session.id)
    updateSessions(
      exists
        ? sessions.map((s) => (s.id === session.id ? session : s))
        : [...sessions, session],
    )
    setEditing(null)
    setSelectedDate(session.date)
    setFocusVenueId(session.venueId)
  }

  function remove(id: string) {
    updateSessions(sessions.filter((s) => s.id !== id))
    setEditing(null)
  }

  function setTicket(id: string, ticketStatus: TicketStatus) {
    updateSessions(
      sessions.map((s) => (s.id === id ? { ...s, ticketStatus } : s)),
    )
  }

  function togglePerson(id: string, person: PersonId) {
    updateSessions(
      sessions.map((s) => {
        if (s.id !== id) return s
        const has = s.attendees.includes(person)
        return {
          ...s,
          attendees: has
            ? s.attendees.filter((p) => p !== person)
            : [...s.attendees, person],
        }
      }),
    )
  }

  function resetSeed() {
    if (!window.confirm('Reset plan to seeded family/Mike wishlist?')) return
    const seed = buildSeedPlan()
    updateSessions(seed)
    setSelectedDate(null)
    setEditing(null)
  }

  return (
    <div className="planner" data-testid="planner">
      <header className="planner-hero">
        <p className="eyebrow">LA 2028 Summer Olympics · Los Angeles</p>
        <h1>Family ticket planner</h1>
        <p className="lede">
          Seeded from your spreadsheet medal days for sports the family ranked
          highly (July 2028 Summer Games). Default attendees are top-3 picks
          (everyone for Ceremonies / Athletics / Swimming). Session times are
          editable estimates — mark Have / Want / Skip, adjust who is going, and
          we flag double-books.
        </p>
        <div className="stat-row">
          <span data-testid="count-have">{counts.have} have tickets</span>
          <span data-testid="count-want">{counts.want} want tickets</span>
          <span>{counts.skip} skipped</span>
          <span data-testid="count-conflicts">{counts.conflicts} double-books</span>
        </div>
      </header>

      <div className="planner-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setEditing('new')}
        >
          Add session
        </button>
        <button type="button" className="btn btn-ghost" onClick={resetSeed}>
          Reset to seed
        </button>
        <div className="filters" role="group" aria-label="Ticket filter">
          {TICKET_FILTERS.map((t) => (
            <button
              key={t}
              type="button"
              className={ticketFilter === t ? 'chip active' : 'chip'}
              onClick={() => setTicketFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="inline">
          Person
          <select
            value={personFilter}
            onChange={(e) =>
              setPersonFilter(e.target.value as PersonId | 'all')
            }
          >
            <option value="all">Everyone</option>
            {PEOPLE.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="day-rail" role="tablist" aria-label="Days">
        <button
          type="button"
          className={!selectedDate ? 'day-chip active' : 'day-chip'}
          onClick={() => setSelectedDate(null)}
        >
          All days
        </button>
        {dates.map((d) => (
          <button
            key={d}
            type="button"
            className={selectedDate === d ? 'day-chip active' : 'day-chip'}
            onClick={() => setSelectedDate(d)}
          >
            {formatDisplayDate(d)}
          </button>
        ))}
      </div>

      <div className="planner-layout">
        <div className="session-list">
          {filtered.length === 0 ? (
            <p className="empty">No sessions match these filters.</p>
          ) : (
            filtered.map((s) => {
              const venue = VENUE_BY_ID[s.venueId]
              const personHits = (byPerson[personFilter === 'all' ? '' : personFilter] ??
                [])
              const hasConflict =
                personFilter === 'all'
                  ? conflicts.some(
                      (c) =>
                        c.type === 'overlap' &&
                        (c.a.id === s.id || c.b.id === s.id),
                    )
                  : personHits.some(
                      (c) =>
                        c.type === 'overlap' &&
                        (c.a.id === s.id || c.b.id === s.id),
                    )
              return (
                <article
                  key={s.id}
                  className={`session-card status-${s.ticketStatus}${hasConflict ? ' conflicted' : ''}`}
                  data-testid={`session-${s.id}`}
                >
                  <div className="session-top">
                    <div>
                      <p className="when">
                        {formatDisplayDate(s.date)} · {s.startTime}–{s.endTime}
                        {s.timeEstimated ? ' · est.' : ''}
                      </p>
                      <h3>
                        {s.sport}{' '}
                        <span className={`kind kind-${s.kind}`}>{s.kind}</span>
                      </h3>
                      <p className="venue">
                        {s.venueLabel}
                        {venue ? ` · ${venue.area}` : ''}
                      </p>
                    </div>
                    <div className="ticket-toggle" role="group" aria-label="Ticket status">
                      {(['have', 'want', 'skip'] as TicketStatus[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={s.ticketStatus === t ? `tix active ${t}` : `tix ${t}`}
                          aria-label={`Mark ${s.sport} on ${s.date} as ${t}`}
                          onClick={() => setTicket(s.id, t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>                  </div>

                  <div className="attendees">
                    {PEOPLE.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={
                          s.attendees.includes(p) ? 'person on' : 'person'
                        }
                        aria-pressed={s.attendees.includes(p)}
                        onClick={() => togglePerson(s.id, p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {s.notes ? <p className="notes">{s.notes}</p> : null}

                  <div className="session-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setEditing(s)
                        setFocusVenueId(s.venueId)
                      }}
                    >
                      Edit time / details
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setSelectedDate(s.date)
                        setFocusVenueId(s.venueId)
                      }}
                    >
                      Show on map
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>

        <aside className="planner-side">
          <VenueMap
            sessions={sessions}
            focusVenueId={focusVenueId}
            selectedDate={selectedDate}
          />
          <ConflictPanel
            byPerson={byPerson}
            onFocus={(s) => {
              setSelectedDate(s.date)
              setFocusVenueId(s.venueId)
              setEditing(s)
            }}
          />
        </aside>
      </div>

      {editing ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true">
            <EventForm
              initial={editing === 'new' ? null : editing}
              onSave={upsert}
              onCancel={() => setEditing(null)}
              onDelete={editing === 'new' ? undefined : remove}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
