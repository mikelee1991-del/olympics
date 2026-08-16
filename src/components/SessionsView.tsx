import SessionList from './SessionList'
import PlanFilters from './PlanFilters'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'

type Props = {
  plan: PlanState
  onOpenMap: () => void
}

export default function SessionsView({ plan, onOpenMap }: Props) {
  return (
    <div className="view sessions-view" data-testid="sessions-view">
      <header className="view-hero">
        <p className="eyebrow">Tickets & people</p>
        <h1>Sessions</h1>
        <p className="lede">
          Mark have / want / skip and who is going. Times are estimates until you
          edit them.
        </p>
      </header>

      <div className="planner-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => plan.setEditing('new')}
        >
          Add session
        </button>
        <button type="button" className="btn btn-ghost" onClick={plan.resetSeed}>
          Reset to seed
        </button>
      </div>

      <PlanFilters plan={plan} showDateFilter showAllDaysOption />

      <SessionList
        sessions={plan.filtered}
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
      />

      <EditModal plan={plan} />
    </div>
  )
}
