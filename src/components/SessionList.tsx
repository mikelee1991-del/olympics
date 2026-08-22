import { PEOPLE, type PersonId } from '../data/family'
import { accessLabel, isFreeAccess } from '../data/access'
import {
  formatDisplayDate,
  type PlannedSession,
  type TicketStatus,
} from '../data/planner'
import type { Conflict } from '../lib/conflicts'
import { VENUE_BY_ID } from '../data/venues'

type Props = {
  sessions: PlannedSession[]
  conflicts: Conflict[]
  personFilter: PersonId | 'all'
  onEdit: (s: PlannedSession) => void
  onSetTicket: (id: string, status: TicketStatus) => void
  onTogglePerson: (id: string, person: PersonId) => void
  onShowMap?: (s: PlannedSession) => void
  emptyMessage?: string
}

export default function SessionList({
  sessions,
  conflicts,
  personFilter,
  onEdit,
  onSetTicket,
  onTogglePerson,
  onShowMap,
  emptyMessage = 'No sessions match these filters.',
}: Props) {
  if (sessions.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <div className="session-list" data-testid="session-list">
      {sessions.map((s) => {
        const venue = VENUE_BY_ID[s.venueId]
        const hasConflict = conflicts.some(
          (c) =>
            (c.a.id === s.id || c.b.id === s.id) &&
            (personFilter === 'all' || c.person === personFilter),
        )
        return (
          <article
            key={s.id}
            className={`session-card status-${s.ticketStatus}${hasConflict ? ' conflicted' : ''}${isFreeAccess(s.access) ? ' access-free' : ''}`}
            data-testid={`session-${s.id}`}
            data-access={s.access}
          >
            <div className="session-top">
              <div>
                <p className="when">
                  {formatDisplayDate(s.date)} · {s.startTime}–{s.endTime}
                  {s.timeEstimated ? ' · est.' : ''}
                </p>
                <h3>
                  {s.sport}{' '}
                  <span
                    className={`games-badge games-${s.games ?? 'olympic'}`}
                  >
                    {(s.games ?? 'olympic') === 'paralympic' ? 'Para' : 'Oly'}
                  </span>
                  <span className={`kind kind-${s.kind}`}>{s.kind}</span>
                  {s.access !== 'ticketed' ? (
                    <span className="access-badge access-free">
                      {accessLabel(s.access)}
                    </span>
                  ) : (
                    <span className="access-badge access-ticketed">
                      Ticketed
                    </span>
                  )}
                  {s.ticketQty ? (
                    <span className="access-badge access-qty">
                      {s.attendees.length}/{s.ticketQty} seats
                    </span>
                  ) : null}
                </h3>
                <p className="venue">
                  {s.venueLabel}
                  {venue ? ` · ${venue.area}` : ''}
                </p>
              </div>
              <div
                className="ticket-toggle"
                role="group"
                aria-label="Ticket status"
              >
                {(['have', 'want', 'skip'] as TicketStatus[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={
                      s.ticketStatus === t ? `tix active ${t}` : `tix ${t}`
                    }
                    aria-label={`Mark ${s.sport} on ${s.date} as ${t}`}
                    onClick={() => onSetTicket(s.id, t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="attendees">
              <span className="attendees-label">
                {s.ticketStatus === 'have'
                  ? s.ticketQty
                    ? 'Seats'
                    : 'Going'
                  : 'Want to go'}
              </span>
              {PEOPLE.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={s.attendees.includes(p) ? 'person on' : 'person'}
                  aria-pressed={s.attendees.includes(p)}
                  onClick={() => onTogglePerson(s.id, p)}
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
                onClick={() => onEdit(s)}
              >
                Edit
              </button>
              {onShowMap ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onShowMap(s)}
                >
                  Map
                </button>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
