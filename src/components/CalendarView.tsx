import MonthCalendar from './MonthCalendar'
import SessionList from './SessionList'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'
import { formatDisplayDate } from '../data/planner'

type Props = {
  plan: PlanState
  onOpenSessions: () => void
  onOpenMap: () => void
}

export default function CalendarView({
  plan,
  onOpenSessions,
  onOpenMap,
}: Props) {
  const daySessions = plan.sessions
    .filter((s) => s.date === plan.selectedDate)
    .filter((s) => s.ticketStatus !== 'skip')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="view calendar-view" data-testid="calendar-view">
      <header className="view-hero">
        <p className="eyebrow">LA 2028 Summer Olympics</p>
        <h1>July calendar</h1>
        <p className="lede">
          Pick a day to see that agenda. Session times come from the LA28 official
          By Event schedule. Manage tickets on Sessions; venues on Map; travel
          math on Conflicts.
        </p>
        <div className="stat-row">
          <span data-testid="count-have">{plan.counts.have} have</span>
          <span data-testid="count-want">{plan.counts.want} want</span>
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
              : `${daySessions.length} session${daySessions.length === 1 ? '' : 's'} (skipped hidden)`}
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
