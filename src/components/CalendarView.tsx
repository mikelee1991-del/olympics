import { useEffect, useMemo } from 'react'
import MonthCalendar from './MonthCalendar'
import SessionList from './SessionList'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'
import {
  formatDisplayDate,
  type GamesKind,
  type PlannedSession,
} from '../data/planner'

type Props = {
  plan: PlanState
  onOpenSessions: () => void
  onOpenMap: () => void
}

function agendaRank(s: PlannedSession): number {
  if (s.ticketStatus === 'have' && (s.ticketQty != null || s.access === 'ticketed'))
    return 0
  if (s.ticketStatus === 'have') return 1
  if (s.access === 'free') return 2
  if (s.access === 'boat') return 3
  return 4
}

export default function CalendarView({
  plan,
  onOpenSessions,
  onOpenMap,
}: Props) {
  const games: GamesKind = plan.gamesFilter

  const scopedSessions = useMemo(
    () => plan.sessions.filter((s) => (s.games ?? 'olympic') === games),
    [plan.sessions, games],
  )

  const daySessions = scopedSessions
    .filter((s) => s.date === plan.selectedDate)
    .filter((s) => s.ticketStatus !== 'skip')
    .sort((a, b) => {
      const byRank = agendaRank(a) - agendaRank(b)
      if (byRank !== 0) return byRank
      return a.startTime.localeCompare(b.startTime)
    })

  const dayHave = daySessions.filter((s) => s.ticketStatus === 'have')
  const dayPurchased = dayHave.filter(
    (s) => s.ticketQty != null || s.access === 'ticketed',
  )

  // Keep selected date inside the active Games window.
  useEffect(() => {
    const inScope = scopedSessions.some((s) => s.date === plan.selectedDate)
    if (inScope) return
    const fallback =
      games === 'olympic'
        ? scopedSessions.find(
            (s) =>
              s.ticketStatus === 'have' &&
              (s.ticketQty != null || s.access === 'ticketed'),
          )?.date ?? '2028-07-14'
        : scopedSessions.find((s) => s.kind === 'CEREMONY')?.date ??
          '2028-08-15'
    plan.setSelectedDate(fallback)
    // Only re-run when games filter or scoped session set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, scopedSessions])

  return (
    <div className="view calendar-view" data-testid="calendar-view">
      <header className="view-hero">
        <p className="eyebrow">LA 2028 Summer Games</p>
        <h1>Calendar</h1>
        <p className="lede">
          Olympics in July (your tickets first). Paralympics in August as a
          planning placeholder — no tickets purchased yet.
        </p>
        <div className="games-toggle" role="group" aria-label="Games">
          <button
            type="button"
            className={games === 'olympic' ? 'chip active' : 'chip'}
            data-testid="games-olympic"
            onClick={() => plan.setGamesFilter('olympic')}
          >
            Olympics · July
          </button>
          <button
            type="button"
            className={games === 'paralympic' ? 'chip active' : 'chip'}
            data-testid="games-paralympic"
            onClick={() => plan.setGamesFilter('paralympic')}
          >
            Paralympics · August
          </button>
        </div>
        <div className="stat-row">
          <span data-testid="count-have">
            {scopedSessions.filter((s) => s.ticketStatus === 'have').length} have
          </span>
          <span data-testid="count-want">
            {scopedSessions.filter((s) => s.ticketStatus === 'want').length} want
          </span>
          <span data-testid="count-free">
            {scopedSessions.filter((s) => s.access === 'free').length} free
          </span>
          <span data-testid="count-boat">
            {scopedSessions.filter((s) => s.access === 'boat').length} boat
          </span>
        </div>
      </header>

      <MonthCalendar
        sessions={plan.sessions}
        selectedDate={plan.selectedDate}
        onSelectDate={plan.setSelectedDate}
        games={games}
      />

      <section className="day-agenda" aria-live="polite">
        <div className="section-head">
          <h2>
            {plan.selectedDate
              ? formatDisplayDate(plan.selectedDate)
              : 'Select a day'}
          </h2>
          <p>
            {daySessions.length === 0
              ? 'No active sessions this day.'
              : dayPurchased.length > 0
                ? `You have tickets for ${dayPurchased.map((s) => s.sport).join(', ')}`
                : games === 'paralympic'
                  ? `${daySessions.length} Paralympic session${daySessions.length === 1 ? '' : 's'} (wishlist — no tickets yet)`
                  : dayHave.length > 0
                    ? `${dayHave.length} free/have session${dayHave.length === 1 ? '' : 's'} this day`
                    : 'Wishlist only — no purchased tickets this day'}
          </p>
        </div>

        <div className="agenda-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => plan.setEditing('new')}
          >
            Add session
          </button>
          <button type="button" className="btn btn-ghost" onClick={onOpenSessions}>
            Manage tickets
          </button>
          <button type="button" className="btn btn-ghost" onClick={onOpenMap}>
            View map
          </button>
        </div>

        <SessionList
          sessions={daySessions}
          conflicts={plan.conflicts}
          personFilter={plan.personFilter}
          onEdit={(s) => plan.setEditing(s)}
          onSetTicket={plan.setTicket}
          onTogglePerson={plan.togglePerson}
          onShowMap={(s) => {
            plan.setSelectedDate(s.date)
            plan.setFocusVenueId(s.venueId)
            onOpenMap()
          }}
          emptyMessage="Nothing planned this day — add a session or pick another date."
        />
      </section>

      <EditModal plan={plan} />
    </div>
  )
}
