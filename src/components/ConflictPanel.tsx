import type { Conflict } from '../lib/conflicts'
import { formatDisplayDate, type PlannedSession } from '../data/planner'
import type { PersonId } from '../data/family'

type Props = {
  byPerson: Record<string, Conflict[]>
  onFocus: (session: PlannedSession) => void
}

function label(c: Conflict): string {
  const when = formatDisplayDate(c.a.date)
  if (c.type === 'overlap') {
    return `${when}: ${c.a.sport} (${c.a.startTime}–${c.a.endTime}) overlaps ${c.b.sport} (${c.b.startTime}–${c.b.endTime})`
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
          No double-books or can&apos;t-make-it travel flags for active tickets.
        </p>
      </section>
    )
  }

  return (
    <section className="panel conflicts bad" data-testid="conflicts">
      <h2>Conflicts ({total})</h2>
      <p>
        Overlaps and hops where the gap is shorter than drive + parking exit/enter
        + contingency, by person.
      </p>
      <div className="conflict-people">
        {people.map((person) => (
          <div key={person} className="conflict-person">
            <h3>{person}</h3>
            <ul>
              {byPerson[person].map((c, idx) => (
                <li key={`${person}-${idx}`}>
                  <span className={`tag ${c.type}`}>
                    {c.type === 'overlap' ? 'Double-booked' : "Can't make it"}
                  </span>
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
