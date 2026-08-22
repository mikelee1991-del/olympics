import { useMemo } from 'react'
import {
  formatDisplayDate,
  type GamesKind,
  type PlannedSession,
} from '../data/planner'

type Props = {
  sessions: PlannedSession[]
  selectedDate: string | null
  onSelectDate: (iso: string) => void
  games: GamesKind
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const WINDOWS: Record<
  GamesKind,
  { year: number; month: number; startDay: number; endDay: number; label: string }
> = {
  olympic: {
    year: 2028,
    month: 7,
    startDay: 14,
    endDay: 30,
    label: 'Olympic Games window',
  },
  paralympic: {
    year: 2028,
    month: 8,
    startDay: 13,
    endDay: 27,
    label: 'Paralympic Games window',
  },
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

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
    'Para Swimming': 'Para swim',
    'Para Athletics (Track & Field)': 'Para track',
    'Para Athletics (Marathon)': 'Para marathon',
    'Para Cycling Track': 'Para track bike',
    'Para Cycling Road': 'Para road',
    'Para Archery': 'Para archery',
    'Para Badminton': 'Para badminton',
    'Para Canoe': 'Para canoe',
    'Para Climbing': 'Para climb',
    'Para Equestrian': 'Para equestrian',
    'Para Rowing': 'Para rowing',
    'Para Table Tennis': 'Para TT',
    'Para Triathlon': 'Para triathlon',
    'Para Powerlifting': 'Powerlifting',
    'Para Taekwondo': 'Para TKD',
    'Para Judo': 'Para judo',
    'Blind Football (Soccer)': 'Blind football',
    'Sitting Volleyball': 'Sitting VB',
    'Wheelchair Basketball': 'WC basketball',
    'Wheelchair Rugby': 'WC rugby',
    'Wheelchair Tennis': 'WC tennis',
    'Wheelchair Fencing': 'WC fencing',
    'Shooting Para Sport': 'Para shooting',
  }
  return aliases[sport] ?? sport
}

type DayBucket = {
  purchased: PlannedSession[]
  free: PlannedSession[]
  boat: PlannedSession[]
  want: PlannedSession[]
  ceremony: PlannedSession[]
}

function emptyBucket(): DayBucket {
  return { purchased: [], free: [], boat: [], want: [], ceremony: [] }
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
  games,
}: Props) {
  const win = WINDOWS[games]
  const scoped = useMemo(
    () => sessions.filter((s) => (s.games ?? 'olympic') === games),
    [sessions, games],
  )

  const byDate = useMemo(() => {
    const map = new Map<string, DayBucket>()
    for (const s of scoped) {
      if (s.ticketStatus === 'skip') continue
      const cur = map.get(s.date) ?? emptyBucket()
      if (s.kind === 'CEREMONY') cur.ceremony.push(s)
      if (isPurchased(s)) cur.purchased.push(s)
      else if (s.access === 'free' && s.ticketStatus === 'have') cur.free.push(s)
      else if (s.access === 'boat') cur.boat.push(s)
      else if (s.ticketStatus === 'want') cur.want.push(s)
      else if (s.ticketStatus === 'have') cur.purchased.push(s)
      map.set(s.date, cur)
    }
    return map
  }, [scoped])

  const jumpDays = useMemo(() => {
    return [...byDate.entries()]
      .filter(([, b]) =>
        games === 'olympic'
          ? b.purchased.length > 0
          : b.want.length > 0 || b.ceremony.length > 0 || b.free.length > 0,
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, b]) => {
        const list =
          games === 'olympic'
            ? b.purchased
            : [...b.ceremony, ...b.want, ...b.free]
        return {
          iso,
          sports: [...new Set(list.map((s) => shortSport(s.sport)))].slice(0, 3),
          qty:
            games === 'olympic'
              ? b.purchased.reduce((n, s) => n + (s.ticketQty ?? 1), 0)
              : list.length,
        }
      })
  }, [byDate, games])

  const cells = useMemo(() => {
    const firstIso = isoDate(win.year, win.month, win.startDay)
    const startPad = new Date(`${firstIso}T12:00:00`).getDay()
    const out: Array<{ day: number | null; iso: string | null }> = []
    for (let i = 0; i < startPad; i++) out.push({ day: null, iso: null })
    for (let d = win.startDay; d <= win.endDay; d++) {
      out.push({ day: d, iso: isoDate(win.year, win.month, d) })
    }
    while (out.length % 7 !== 0) out.push({ day: null, iso: null })
    return out
  }, [win])

  const monthLabel =
    games === 'olympic' ? 'July 2028 · Olympics' : 'August 2028 · Paralympics'

  return (
    <section
      className="month-cal"
      data-testid="month-calendar"
      aria-label={monthLabel}
    >
      <header className="month-cal-head">
        <h2>{monthLabel}</h2>
        <p>
          Showing the {win.label} only (days {win.startDay}–{win.endDay}).{' '}
          {games === 'olympic'
            ? 'Solid green days are tickets you already have.'
            : 'Paralympics placeholder — nothing purchased yet; mark want as you decide.'}
        </p>
      </header>

      {games === 'paralympic' ? (
        <div className="para-banner" data-testid="para-banner">
          <strong>No Paralympic tickets yet.</strong> Seeded medal/ceremony
          sessions from LA28 By Event V3.2 so you can plan — all start as{' '}
          <em>want</em>.
        </div>
      ) : null}

      {jumpDays.length > 0 ? (
        <div className="ticket-jump" data-testid="ticket-jump">
          <p className="ticket-jump-label">
            {games === 'olympic' ? 'Your ticket days' : 'Paralympic days to review'}
          </p>
          <div className="ticket-jump-list">
            {jumpDays.map((d) => (
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
                <span className="ticket-jump-qty">
                  {games === 'olympic' ? `${d.qty} tix` : `${d.qty} sessions`}
                </span>
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
          const ceremony = bucket?.ceremony ?? []
          const active = selectedDate === cell.iso
          const hasTickets = purchased.length > 0
          const hasFree = free.length > 0
          const hasBoatOnly = boat.length > 0 && !hasTickets && !hasFree
          const hasWant =
            games === 'paralympic' &&
            (want.length > 0 || ceremony.length > 0) &&
            !hasTickets

          const sportLabels = [
            ...new Set(
              (hasTickets ? purchased : hasWant ? [...ceremony, ...want] : [])
                .map((s) => shortSport(s.sport)),
            ),
          ]
          const shown = sportLabels.slice(0, 2)
          const extra = sportLabels.length - shown.length

          let ariaExtra = ''
          if (hasTickets) ariaExtra = `, have tickets: ${sportLabels.join(', ')}`
          else if (hasFree)
            ariaExtra = `, free course: ${free.map((s) => shortSport(s.sport)).join(', ')}`
          else if (hasWant) ariaExtra = `, wishlist: ${sportLabels.join(', ')}`
          else if (hasBoatOnly) ariaExtra = ', boat-viewable sessions'

          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              className={[
                'cal-cell',
                'games',
                active ? 'active' : '',
                hasTickets ? 'ticket-day' : '',
                hasFree && !hasTickets ? 'free-day' : '',
                hasBoatOnly ? 'boat-day' : '',
                hasWant ? 'want-day-hot' : '',
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
              ) : hasWant ? (
                <span className="cal-labels">
                  <span className="cal-tag want">WANT</span>
                  {shown.map((name) => (
                    <span key={name} className="cal-sport">
                      {name}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="cal-sport more">+{extra}</span>
                  ) : null}
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
        {games === 'olympic' ? (
          <>
            <span>
              <span className="cal-tag have">HAVE</span> tickets purchased
            </span>
            <span>
              <span className="cal-tag free">FREE</span> course (no ticket needed)
            </span>
            <span>
              <span className="cal-tag boat">BOAT</span> watchable from a boat
            </span>
          </>
        ) : (
          <>
            <span>
              <span className="cal-tag want">WANT</span> no tickets yet
            </span>
            <span>
              <span className="cal-tag free">FREE</span> likely course events
            </span>
          </>
        )}
      </div>
    </section>
  )
}
