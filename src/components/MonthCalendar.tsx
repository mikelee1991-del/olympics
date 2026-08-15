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

export default function MonthCalendar({
  sessions,
  selectedDate,
  onSelectDate,
  year = 2028,
  month = 7,
}: Props) {
  const byDate = useMemo(() => {
    const map = new Map<
      string,
      { have: number; want: number; skip: number; total: number }
    >()
    for (const s of sessions) {
      const cur = map.get(s.date) ?? { have: 0, want: 0, skip: 0, total: 0 }
      cur.total += 1
      cur[s.ticketStatus] += 1
      map.set(s.date, cur)
    }
    return map
  }, [sessions])

  const cells = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const startPad = first.getDay() // 0 = Sunday
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
    <section className="month-cal" data-testid="month-calendar" aria-label={monthLabel}>
      <header className="month-cal-head">
        <h2>{monthLabel}</h2>
        <p>LA 2028 Summer Games · click a day for that agenda</p>
      </header>

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
          const stats = byDate.get(cell.iso)
          const active = selectedDate === cell.iso
          const inGames =
            cell.day >= 10 && cell.day <= 30
          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              className={`cal-cell${active ? ' active' : ''}${stats ? ' has-events' : ''}${inGames ? ' games' : ''}`}
              aria-label={`${formatDisplayDate(cell.iso)}${stats ? `, ${stats.total} sessions` : ''}`}
              aria-pressed={active}
              onClick={() => onSelectDate(cell.iso!)}
            >
              <span className="cal-daynum">{cell.day}</span>
              {stats ? (
                <span className="cal-dots" aria-hidden="true">
                  {stats.have > 0 ? <i className="dot have" /> : null}
                  {stats.want > 0 ? <i className="dot want" /> : null}
                  <span className="cal-count">{stats.total}</span>
                </span>
              ) : (
                <span className="cal-dots muted">—</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="cal-legend">
        <span>
          <i className="dot have" /> have tickets
        </span>
        <span>
          <i className="dot want" /> want tickets
        </span>
        <span>Number = sessions that day</span>
      </div>
    </section>
  )
}
