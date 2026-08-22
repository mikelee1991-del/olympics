import { accessLabel } from '../data/access'
import type { Conflict } from '../lib/conflicts'
import {
  formatDisplayDate,
  type PlannedSession,
} from '../data/planner'
import type { PersonId } from '../data/family'

type Props = {
  byPerson: Record<string, Conflict[]>
  onFocus: (session: PlannedSession) => void
}

function accessTag(s: PlannedSession): string {
  if (s.access === 'free') return 'Free course'
  if (s.access === 'boat') return 'Free w/ boat'
  if (s.ticketQty != null) {
    return `Ticketed · ${s.ticketQty} tix · ${s.ticketStatus}`
  }
  return `Ticketed · ${s.ticketStatus}`
}

function accessClass(s: PlannedSession): string {
  if (s.access === 'free') return 'access-free'
  if (s.access === 'boat') return 'access-boat'
  if (s.ticketQty != null) return 'access-qty'
  return 'access-ticketed'
}

function sessionBit(s: PlannedSession): string {
  return `${s.sport} (${s.startTime}–${s.endTime})`
}

function label(c: Conflict): string {
  const when = formatDisplayDate(c.a.date)
  if (c.type === 'overlap') {
    return `${when}: ${sessionBit(c.a)} overlaps ${sessionBit(c.b)}`
  }
  const travel = c.travel
  const need = travel ? `need ${travel.requiredGapMin} min` : 'need more buffer'
  const detail = travel
    ? ` (drive ${travel.driveMin} + park ${travel.parkExitMin + travel.parkEnterMin} + buffer ${travel.contingencyMin}; ${travel.distanceKm} km)`
    : ''
  return `${when}: only ${c.minutesBetween} min between ${c.a.sport} @ ${c.a.venueLabel} → ${c.b.sport} @ ${c.b.venueLabel}; ${need}${detail}`
}

export default function ConflictPanel({ byPerson, onFocus }: Props) {
  const people = Object.keys(byPerson).sort() as PersonId[]
  const total = people.reduce((n, p) => n + byPerson[p].length, 0)

  if (total === 0) {
    return (
      <section className="panel conflicts ok" data-testid="conflicts">
        <h2>Conflicts</h2>
        <p className="ok-msg">
          No double-books or can&apos;t-make-it travel flags for people assigned
          to sessions. Free / boat events stay opt-in until you tap attendees.
        </p>
      </section>
    )
  }

  return (
    <section className="panel conflicts bad" data-testid="conflicts">
      <h2>Conflicts ({total})</h2>
      <p>
        Overlaps and hops where the gap is shorter than drive + parking
        exit/enter + contingency. Each side shows whether it&apos;s{' '}
        <strong>ticketed</strong>, <strong>free course</strong>, or{' '}
        <strong>free w/ boat</strong>. Purchased seats are seated by sport
        interest (open seats stay empty — assign on Sessions).
      </p>
      <div className="conflict-people">
        {people.map((person) => (
          <div key={person} className="conflict-person">
            <h3>{person}</h3>
            <ul>
              {byPerson[person].map((c, idx) => (
                <li key={`${person}-${idx}`}>
                  <div className="conflict-meta">
                    <span className={`tag ${c.type}`}>
                      {c.type === 'overlap' ? 'Double-booked' : "Can't make it"}
                    </span>
                    <span
                      className={`access-badge ${accessClass(c.a)}`}
                      title={accessLabel(c.a.access)}
                    >
                      {accessTag(c.a)}
                    </span>
                    <span className="conflict-vs" aria-hidden>
                      vs
                    </span>
                    <span
                      className={`access-badge ${accessClass(c.b)}`}
                      title={accessLabel(c.b.access)}
                    >
                      {accessTag(c.b)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => onFocus(c.a)}
                  >
                    {label(c)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
