import ConflictPanel from './ConflictPanel'
import EditModal from './EditModal'
import type { PlanState } from '../hooks/usePlan'

type Props = {
  plan: PlanState
  onOpenSessions: () => void
}

export default function ConflictsView({ plan, onOpenSessions }: Props) {
  return (
    <div className="view conflicts-view" data-testid="conflicts-view">
      <header className="view-hero">
        <p className="eyebrow">By person</p>
        <h1>Conflicts</h1>
        <p className="lede">
          Double-books and hops that leave too little time for driving and
          parking. Fix tickets or attendees on Sessions.
        </p>
        <div className="stat-row">
          <span data-testid="count-conflicts">
            {plan.counts.overlaps} double-books
          </span>
          <span data-testid="count-travel">
            {plan.counts.cantMakeIt} can&apos;t make it
          </span>
        </div>
      </header>

      <button type="button" className="btn btn-ghost" onClick={onOpenSessions}>
        Open sessions
      </button>

      <ConflictPanel
        byPerson={plan.byPerson}
        onFocus={(s) => {
          plan.setSelectedDate(s.date)
          plan.setFocusVenueId(s.venueId)
          plan.setEditing(s)
        }}
      />

      <EditModal plan={plan} />
    </div>
  )
}
