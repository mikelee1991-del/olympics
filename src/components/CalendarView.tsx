import MonthCalendar from './MonthCalendar'
import SessionList from './SessionList'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'
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
  if (s.access === 'free') return 2
  if (s.access === 'boat') return 3
  return 4
}

export default function CalendarView({
  plan,
  onOpenSessions,
  onOpenMap,
}: Props) {
  const daySessions = plan.sessions
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

  return (
    <div className="view calendar-view" data-testid="calendar-view">
      <header className="view-hero">
        <p className="eyebrow">LA 2028 Summer Olympics</p>
        <h1>July calendar</h1>
        <p className="lede">
          Green <strong>HAVE</strong> days are tickets you already bought. Jump
          from the list under the title, or tap a day for the agenda.
        </p>
        <div className="stat-row">
          <span data-testid="count-have">{plan.counts.have} have</span>
          <span data-testid="count-want">{plan.counts.want} want</span>
          <span data-testid="count-free">{plan.counts.free} free</span>
          <span data-testid="count-boat">{plan.counts.boat} boat</span>
          <span data-testid="count-conflicts">
            {plan.counts.overlaps} double-books
          </span>
          <span data-testid="count-travel">
            {plan.counts.cantMakeIt} can&apos;t make it
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
          </h2>
          <p>
            {daySessions.length === 0
              ? 'No active sessions this day.'
              : dayPurchased.length > 0
                ? `You have tickets for ${dayPurchased.map((s) => s.sport).join(', ')}`
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
