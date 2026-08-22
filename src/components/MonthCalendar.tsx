import { useMemo } from 'react'
import {
  formatDisplayDate,
  type PlannedSession,
} from '../data/planner'

type Props = {
  sessions: PlannedSession[]
  selectedDate: string | null
  onSelectDate: (iso: string) => void
  year?: number
  month?: number // 1-12
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Compact labels that fit in a calendar cell. */
function shortSport(sport: string): string {
  const aliases: Record<string, string> = {
    'Canoe Sprint': 'Canoe',
    'Artistic Gymnastics': 'Gymnastics',
    'Trampoline Gymnastics': 'Trampoline',
    'Cycling Track': 'Track',
    'Cycling Road': 'Road race',
    'Beach Volleyball': 'Beach VB',
    'Open Water Swimming': 'Open water',
    'Rowing Coastal Beach Sprints': 'Coastal row',
    'Modern Pentathlon': 'Pentathlon',
    'Rugby Sevens': 'Rugby',
    'Water Polo': 'Water polo',
    'Table Tennis': 'Table tennis',
  }
  return aliases[sport] ?? sport
}

type DayBucket = {
  purchased: PlannedSession[]
  free: PlannedSession[]
  boat: PlannedSession[]
  want: PlannedSession[]
}

function emptyBucket(): DayBucket {
  return { purchased: [], free: [], boat: [], want: [] }
}

function isPurchased(s: PlannedSession): boolean {
  return (
    s.ticketStatus === 'have' &&
    (s.ticketQty != null || s.access === 'ticketed')
  )
}

export default function MonthCalendar({
  sessions,
  selectedDate,
  onSelectDate,
  year = 2028,
  month = 7,
}: Props) {
  const byDate = useMemo(() => {
    const map = new Map<string, DayBucket>()
    for (const s of sessions) {
      if (s.ticketStatus === 'skip') continue
      const cur = map.get(s.date) ?? emptyBucket()
      if (isPurchased(s)) cur.purchased.push(s)
      else if (s.access === 'free' && s.ticketStatus === 'have') cur.free.push(s)
      else if (s.access === 'boat') cur.boat.push(s)
      else if (s.ticketStatus === 'want') cur.want.push(s)
      else if (s.ticketStatus === 'have') cur.purchased.push(s)
      map.set(s.date, cur)
    }
    return map
  }, [sessions])

  const ticketDays = useMemo(() => {
    return [...byDate.entries()]
      .filter(([, b]) => b.purchased.length > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, b]) => ({
        iso,
        sports: [...new Set(b.purchased.map((s) => shortSport(s.sport)))],
        qty: b.purchased.reduce((n, s) => n + (s.ticketQty ?? 1), 0),
      }))
  }, [byDate])

  const cells = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const out: Array<{ day: number | null; iso: string | null }> = []
    for (let i = 0; i < startPad; i++) out.push({ day: null, iso: null })
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ day: d, iso: isoDate(year, month, d) })
    }
    while (out.length % 7 !== 0) out.push({ day: null, iso: null })
    return out
  }, [year, month])

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      className="month-cal"
      data-testid="month-calendar"
      aria-label={monthLabel}
    >
      <header className="month-cal-head">
        <h2>{monthLabel}</h2>
        <p>
          Solid green days are tickets you already have. Free course days are
          labeled FREE. Everything else stays quiet.
        </p>
      </header>

      {ticketDays.length > 0 ? (
        <div className="ticket-jump" data-testid="ticket-jump">
          <p className="ticket-jump-label">Your ticket days</p>
          <div className="ticket-jump-list">
            {ticketDays.map((d) => (
              <button
                key={d.iso}
                type="button"
                className={
                  selectedDate === d.iso
                    ? 'ticket-jump-chip active'
                    : 'ticket-jump-chip'
                }
                onClick={() => onSelectDate(d.iso)}
              >
                <span className="ticket-jump-date">
                  {formatDisplayDate(d.iso)}
                </span>
                <span className="ticket-jump-sports">
                  {d.sports.join(' · ')}
                </span>
                <span className="ticket-jump-qty">{d.qty} tix</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="cal-weekdays" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="cal-grid" role="grid" aria-label={monthLabel}>
        {cells.map((cell, idx) => {
          if (!cell.iso || cell.day === null) {
            return <div key={`pad-${idx}`} className="cal-cell empty" />
          }
          const bucket = byDate.get(cell.iso)
          const purchased = bucket?.purchased ?? []
          const free = bucket?.free ?? []
          const boat = bucket?.boat ?? []
          const want = bucket?.want ?? []
          const active = selectedDate === cell.iso
          const inGames = cell.day >= 10 && cell.day <= 30
          const hasTickets = purchased.length > 0
          const hasFree = free.length > 0
          const hasBoatOnly = boat.length > 0 && !hasTickets && !hasFree
          const quietWant = want.length > 0 && !hasTickets && !hasFree

          const sportLabels = [
            ...new Set(purchased.map((s) => shortSport(s.sport))),
          ]
          const shown = sportLabels.slice(0, 2)
          const extra = sportLabels.length - shown.length

          let ariaExtra = ''
          if (hasTickets) {
            ariaExtra = `, have tickets: ${sportLabels.join(', ')}`
          } else if (hasFree) {
            ariaExtra = `, free course: ${free.map((s) => shortSport(s.sport)).join(', ')}`
          } else if (hasBoatOnly) {
            ariaExtra = ', boat-viewable sessions'
          }

          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              className={[
                'cal-cell',
                active ? 'active' : '',
                inGames ? 'games' : '',
                hasTickets ? 'ticket-day' : '',
                hasFree && !hasTickets ? 'free-day' : '',
                hasBoatOnly ? 'boat-day' : '',
                quietWant ? 'want-day' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`${formatDisplayDate(cell.iso)}${ariaExtra}`}
              aria-pressed={active}
              data-have={purchased.length}
              data-free={free.length}
              onClick={() => onSelectDate(cell.iso!)}
            >
              <span className="cal-daynum">{cell.day}</span>
              {hasTickets ? (
                <span className="cal-labels">
                  <span className="cal-tag have">HAVE</span>
                  {shown.map((name) => (
                    <span key={name} className="cal-sport">
                      {name}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="cal-sport more">+{extra}</span>
                  ) : null}
                </span>
              ) : hasFree ? (
                <span className="cal-labels">
                  <span className="cal-tag free">FREE</span>
                  <span className="cal-sport">
                    {shortSport(free[0].sport)}
                  </span>
                </span>
              ) : hasBoatOnly ? (
                <span className="cal-labels">
                  <span className="cal-tag boat">BOAT</span>
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="cal-legend">
        <span>
          <span className="cal-tag have">HAVE</span> tickets purchased
        </span>
        <span>
          <span className="cal-tag free">FREE</span> course (no ticket needed)
        </span>
        <span>
          <span className="cal-tag boat">BOAT</span> watchable from a boat
        </span>
      </div>
    </section>
  )
}
