import { useMemo } from 'react'
import type { PersonId } from '../data/family'
import { isFreeAccess } from '../data/access'
import {
  formatDisplayDate,
  type GamesKind,
  type PlannedSession,
} from '../data/planner'

type Props = {
  sessions: PlannedSession[]
  selectedDate: string | null
  onSelectDate: (iso: string) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_BLOCKS: Array<{
  key: string
  year: number
  month: number
  startDay: number
  endDay: number
  title: string
  games: GamesKind
  blurb: string
}> = [
  {
    key: 'jul',
    year: 2028,
    month: 7,
    startDay: 14,
    endDay: 30,
    title: 'July 2028 · Olympics',
    games: 'olympic',
    blurb: 'Solid green = purchased tickets. Gold = wishlist. Names show who is going.',
  },
  {
    key: 'aug',
    year: 2028,
    month: 8,
    startDay: 13,
    endDay: 27,
    title: 'August 2028 · Paralympics',
    games: 'paralympic',
    blurb: 'Paralympic placeholder — no tickets purchased yet. Mark want and assign people.',
  },
]

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
  want: PlannedSession[]
  ceremony: PlannedSession[]
}

function emptyBucket(): DayBucket {
  return { purchased: [], free: [], want: [], ceremony: [] }
}

function isPurchased(s: PlannedSession): boolean {
  return (
    s.ticketStatus === 'have' &&
    (s.ticketQty != null || s.access === 'ticketed')
  )
}

function freeSportLabel(s: PlannedSession): string {
  const name = shortSport(s.sport)
  return s.access === 'boat' ? `${name} · boat` : name
}

function attendeeLine(sessions: PlannedSession[]): string {
  const names = [
    ...new Set(sessions.flatMap((s) => s.attendees)),
  ] as PersonId[]
  if (names.length === 0) return ''
  if (names.length <= 3) return names.join(', ')
  return `${names.slice(0, 2).join(', ')} +${names.length - 2}`
}

function buildCells(
  year: number,
  month: number,
  startDay: number,
  endDay: number,
): Array<{ day: number | null; iso: string | null }> {
  const firstIso = isoDate(year, month, startDay)
  const startPad = new Date(`${firstIso}T12:00:00`).getDay()
  const out: Array<{ day: number | null; iso: string | null }> = []
  for (let i = 0; i < startPad; i++) out.push({ day: null, iso: null })
  for (let d = startDay; d <= endDay; d++) {
    out.push({ day: d, iso: isoDate(year, month, d) })
  }
  while (out.length % 7 !== 0) out.push({ day: null, iso: null })
  return out
}

export default function MonthCalendar({
  sessions,
  selectedDate,
  onSelectDate,
}: Props) {
  const byDate = useMemo(() => {
    const map = new Map<string, DayBucket>()
    for (const s of sessions) {
      if (s.ticketStatus === 'skip') continue
      const cur = map.get(s.date) ?? emptyBucket()
      if (s.kind === 'CEREMONY') cur.ceremony.push(s)
      if (isPurchased(s)) cur.purchased.push(s)
      else if (isFreeAccess(s.access) && s.ticketStatus === 'have')
        cur.free.push(s)
      else if (s.ticketStatus === 'want') cur.want.push(s)
      else if (s.ticketStatus === 'have') cur.purchased.push(s)
      map.set(s.date, cur)
    }
    return map
  }, [sessions])

  const jumpDays = useMemo(() => {
    const out: Array<{
      iso: string
      games: GamesKind
      sports: string[]
      qty: number
      people: string
      kind: 'tickets' | 'review'
    }> = []

    for (const [iso, b] of byDate.entries()) {
      const games: GamesKind = iso.startsWith('2028-08')
        ? 'paralympic'
        : 'olympic'
      if (b.purchased.length > 0) {
        out.push({
          iso,
          games,
          sports: [...new Set(b.purchased.map((s) => shortSport(s.sport)))].slice(
            0,
            3,
          ),
          qty: b.purchased.reduce((n, s) => n + (s.ticketQty ?? 1), 0),
          people: attendeeLine(b.purchased),
          kind: 'tickets',
        })
      } else if (
        games === 'paralympic' &&
        (b.want.length > 0 || b.ceremony.length > 0 || b.free.length > 0)
      ) {
        const list = [...b.ceremony, ...b.want, ...b.free]
        out.push({
          iso,
          games,
          sports: [...new Set(list.map((s) => shortSport(s.sport)))].slice(0, 3),
          qty: list.length,
          people: attendeeLine([...b.want, ...b.ceremony]),
          kind: 'review',
        })
      }
    }

    return out.sort((a, b) => a.iso.localeCompare(b.iso))
  }, [byDate])

  const ticketJumps = jumpDays.filter((d) => d.kind === 'tickets')
  const reviewJumps = jumpDays.filter((d) => d.kind === 'review')

  return (
    <section
      className="month-cal"
      data-testid="month-calendar"
      aria-label="LA 2028 Olympics and Paralympics calendar"
    >
      <header className="month-cal-head">
        <h2>July &amp; August 2028</h2>
        <p>
          Olympics and Paralympics on one calendar. Green = tickets you own;
          gold = wishlist. Names under each day are who is assigned to go.
        </p>
      </header>

      {ticketJumps.length > 0 ? (
        <div className="ticket-jump" data-testid="ticket-jump">
          <p className="ticket-jump-label">Your ticket days</p>
          <div className="ticket-jump-list">
            {ticketJumps.map((d) => (
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
                {d.people ? (
                  <span className="ticket-jump-people">{d.people}</span>
                ) : null}
                <span className="ticket-jump-qty">{d.qty} tix</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {reviewJumps.length > 0 ? (
        <div className="ticket-jump para" data-testid="para-jump">
          <p className="ticket-jump-label">Paralympic days to review</p>
          <div className="ticket-jump-list">
            {reviewJumps.map((d) => (
              <button
                key={d.iso}
                type="button"
                className={
                  selectedDate === d.iso
                    ? 'ticket-jump-chip active para'
                    : 'ticket-jump-chip para'
                }
                onClick={() => onSelectDate(d.iso)}
              >
                <span className="ticket-jump-date">
                  {formatDisplayDate(d.iso)}
                </span>
                <span className="ticket-jump-sports">
                  {d.sports.join(' · ')}
                </span>
                {d.people ? (
                  <span className="ticket-jump-people">{d.people}</span>
                ) : null}
                <span className="ticket-jump-qty">{d.qty} sessions</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {MONTH_BLOCKS.map((block) => (
        <div
          key={block.key}
          className="cal-month-block"
          data-testid={`cal-month-${block.key}`}
        >
          <header className="cal-month-head">
            <h3>{block.title}</h3>
            <p>{block.blurb}</p>
          </header>

          {block.games === 'paralympic' ? (
            <div className="para-banner" data-testid="para-banner">
              <strong>No Paralympic tickets yet.</strong> Seeded sessions start
              as <em>want</em> — tap a day and assign who wants to go.
            </div>
          ) : null}

          <div className="cal-weekdays" aria-hidden="true">
            {WEEKDAYS.map((d) => (
              <div key={`${block.key}-${d}`}>{d}</div>
            ))}
          </div>

          <div
            className="cal-grid"
            role="grid"
            aria-label={block.title}
          >
            {buildCells(
              block.year,
              block.month,
              block.startDay,
              block.endDay,
            ).map((cell, idx) => {
              if (!cell.iso || cell.day === null) {
                return (
                  <div
                    key={`${block.key}-pad-${idx}`}
                    className="cal-cell empty"
                  />
                )
              }
              const bucket = byDate.get(cell.iso)
              const purchased = bucket?.purchased ?? []
              const free = bucket?.free ?? []
              const want = bucket?.want ?? []
              const ceremony = bucket?.ceremony ?? []
              const active = selectedDate === cell.iso
              const hasTickets = purchased.length > 0
              const hasFree = free.length > 0
              const wantList = [...ceremony, ...want]
              const hasWant = wantList.length > 0

              const ticketSports = [
                ...new Set(purchased.map((s) => shortSport(s.sport))),
              ]
              const wantSports = [
                ...new Set(wantList.map((s) => shortSport(s.sport))),
              ]
              const freeSports = [...new Set(free.map((s) => freeSportLabel(s)))]
              const ticketPeople = attendeeLine(purchased)
              const wantPeople = attendeeLine(wantList)
              const freePeople = attendeeLine(free)

              let ariaExtra = ''
              if (hasTickets) {
                ariaExtra += `, have tickets: ${ticketSports.join(', ')}`
                if (ticketPeople) ariaExtra += `, tickets: ${ticketPeople}`
              }
              if (hasWant) {
                ariaExtra += `, wishlist: ${wantSports.join(', ')}`
                if (wantPeople) ariaExtra += `, want: ${wantPeople}`
              }
              if (hasFree) {
                ariaExtra += `, free: ${freeSports.join(', ')}`
                if (freePeople) ariaExtra += `, going: ${freePeople}`
              }

              return (
                <button
                  key={cell.iso}
                  type="button"
                  role="gridcell"
                  className={[
                    'cal-cell',
                    'games',
                    block.games === 'paralympic' ? 'para-month' : 'oly-month',
                    active ? 'active' : '',
                    hasTickets ? 'ticket-day' : '',
                    hasFree && !hasTickets ? 'free-day' : '',
                    hasWant && !hasTickets && !hasFree ? 'want-day-hot' : '',
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
                      {ticketSports.slice(0, 2).map((name) => (
                        <span key={name} className="cal-sport">
                          {name}
                        </span>
                      ))}
                      {ticketSports.length > 2 ? (
                        <span className="cal-sport more">
                          +{ticketSports.length - 2}
                        </span>
                      ) : null}
                      {ticketPeople ? (
                        <span className="cal-attendees">{ticketPeople}</span>
                      ) : (
                        <span className="cal-attendees muted">
                          Assign people
                        </span>
                      )}
                    </span>
                  ) : null}
                  {hasWant ? (
                    <span className="cal-labels">
                      <span className="cal-tag want">WANT</span>
                      {wantSports.slice(0, 2).map((name) => (
                        <span key={name} className="cal-sport">
                          {name}
                        </span>
                      ))}
                      {wantSports.length > 2 ? (
                        <span className="cal-sport more">
                          +{wantSports.length - 2}
                        </span>
                      ) : null}
                      {wantPeople ? (
                        <span className="cal-attendees want-people">
                          {wantPeople}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                  {hasFree ? (
                    <span className="cal-labels">
                      <span className="cal-tag free">FREE</span>
                      {freeSports.slice(0, 2).map((name) => (
                        <span key={name} className="cal-sport">
                          {name}
                        </span>
                      ))}
                      {freeSports.length > 2 ? (
                        <span className="cal-sport more">
                          +{freeSports.length - 2}
                        </span>
                      ) : null}
                      {freePeople ? (
                        <span className="cal-attendees">{freePeople}</span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="cal-legend">
        <span>
          <span className="cal-tag have">HAVE</span> tickets purchased
        </span>
        <span>
          <span className="cal-tag want">WANT</span> wishlist (assign people in
          day agenda)
        </span>
        <span>
          <span className="cal-tag free">FREE</span> course or boat-viewable
          (no venue ticket)
        </span>
      </div>
    </section>
  )
}
