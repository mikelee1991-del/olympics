import { useEffect, useMemo } from 'react'
import MonthCalendar from './MonthCalendar'
import SessionList from './SessionList'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'
import type { PersonId } from '../data/family'
import { formatDisplayDate, type PlannedSession } from '../data/planner'

type Props = {
  plan: PlanState
  onOpenSessions: () => void
  onOpenMap: () => void
}

function agendaRank(s: PlannedSession): number {
  if (s.ticketStatus === 'have' && (s.ticketQty != null || s.access === 'ticketed'))
    return 0
  if (s.ticketStatus === 'have') return 1
  if (s.ticketStatus === 'want') return 2
  if (s.access === 'free') return 3
  if (s.access === 'boat') return 4
  return 5
}

function gamesLabel(date: string): string {
  return date.startsWith('2028-08') ? 'Paralympics' : 'Olympics'
}

function uniqueAttendees(sessions: PlannedSession[]): PersonId[] {
  return [...new Set(sessions.flatMap((s) => s.attendees))]
}

function isPurchasedSession(s: PlannedSession): boolean {
  return s.ticketQty != null || s.access === 'ticketed'
}

export default function CalendarView({
  plan,
  onOpenSessions,
  onOpenMap,
}: Props) {
  const olympic = useMemo(
    () => plan.sessions.filter((s) => (s.games ?? 'olympic') === 'olympic'),
    [plan.sessions],
  )
  const paralympic = useMemo(
    () => plan.sessions.filter((s) => (s.games ?? 'olympic') === 'paralympic'),
    [plan.sessions],
  )

  const daySessions = plan.sessions
    .filter((s) => s.date === plan.selectedDate)
    .filter((s) => s.ticketStatus !== 'skip')
    .sort((a, b) => {
      const byRank = agendaRank(a) - agendaRank(b)
      if (byRank !== 0) return byRank
      return a.startTime.localeCompare(b.startTime)
    })

  const dayHave = daySessions.filter((s) => s.ticketStatus === 'have')
  const dayPurchased = dayHave.filter(isPurchasedSession)
  const dayWant = daySessions.filter((s) => s.ticketStatus === 'want')
  const dayGoing = dayHave.filter((s) => !isPurchasedSession(s))

  const ticketPeople = uniqueAttendees(dayPurchased)
  const wantPeople = uniqueAttendees(dayWant)
  const goingPeople = uniqueAttendees(dayGoing)
  const anyoneAssigned =
    ticketPeople.length + wantPeople.length + goingPeople.length > 0

  useEffect(() => {
    const inScope = plan.sessions.some((s) => s.date === plan.selectedDate)
    if (inScope) return
    const fallback =
      plan.sessions.find(
        (s) =>
          s.ticketStatus === 'have' &&
          (s.ticketQty != null || s.access === 'ticketed'),
      )?.date ??
      plan.sessions.find((s) => s.kind === 'CEREMONY')?.date ??
      '2028-07-14'
    plan.setSelectedDate(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.sessions, plan.selectedDate])

  return (
    <div className="view calendar-view" data-testid="calendar-view">
      <header className="view-hero">
        <p className="eyebrow">LA 2028 Summer Games</p>
        <h1>Calendar</h1>
        <p className="lede">
          Olympics (July) and Paralympics (August) together. Green days are
          tickets you own; gold is wishlist. Assign people on each session in
          the day agenda below.
        </p>
        <div className="stat-row stat-row-split">
          <span data-testid="count-have-oly">
            {olympic.filter((s) => s.ticketStatus === 'have').length} have ·
            Olympics
          </span>
          <span data-testid="count-want-oly">
            {olympic.filter((s) => s.ticketStatus === 'want').length} want ·
            Olympics
          </span>
          <span data-testid="count-have-para">
            {paralympic.filter((s) => s.ticketStatus === 'have').length} have ·
            Paralympics
          </span>
          <span data-testid="count-want-para">
            {paralympic.filter((s) => s.ticketStatus === 'want').length} want ·
            Paralympics
          </span>
        </div>
      </header>

      <MonthCalendar
        sessions={plan.sessions}
        selectedDate={plan.selectedDate}
        onSelectDate={plan.setSelectedDate}
      />

      <section className="day-agenda" aria-live="polite">
        <div className="section-head">
          <h2>
            {plan.selectedDate
              ? formatDisplayDate(plan.selectedDate)
              : 'Select a day'}
            {plan.selectedDate ? (
              <span className="games-pill">
                {gamesLabel(plan.selectedDate)}
              </span>
            ) : null}
          </h2>
          <p>
            {daySessions.length === 0
              ? 'No active sessions this day.'
              : dayPurchased.length > 0
                ? `Tickets: ${dayPurchased.map((s) => s.sport).join(', ')}`
                : dayWant.length > 0
                  ? `${dayWant.length} wishlist session${dayWant.length === 1 ? '' : 's'} — assign who wants to go`
                  : dayHave.length > 0
                    ? `${dayHave.length} free/have session${dayHave.length === 1 ? '' : 's'} this day`
                    : 'Sessions this day'}
          </p>
          {ticketPeople.length > 0 ? (
            <p
              className="day-people day-people-tickets"
              data-testid="day-people-tickets"
            >
              <strong>Tickets:</strong> {ticketPeople.join(', ')}
            </p>
          ) : null}
          {wantPeople.length > 0 ? (
            <p className="day-people day-people-want" data-testid="day-people-want">
              <strong>Want:</strong> {wantPeople.join(', ')}
            </p>
          ) : null}
          {goingPeople.length > 0 ? (
            <p
              className="day-people day-people-going"
              data-testid="day-people-going"
            >
              <strong>Going:</strong> {goingPeople.join(', ')}
            </p>
          ) : null}
          {!anyoneAssigned && daySessions.length > 0 ? (
            <p className="day-people muted" data-testid="day-people-empty">
              No one assigned yet — toggle names on each session below.
            </p>
          ) : null}
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
