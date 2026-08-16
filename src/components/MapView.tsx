import VenueMap from './VenueMap'
import PlanFilters from './PlanFilters'
import { formatDisplayDate } from '../data/planner'
import type { PlanState } from '../hooks/usePlan'

export default function MapView({ plan }: { plan: PlanState }) {
  return (
    <div className="view map-view" data-testid="map-view">
      <header className="view-hero">
        <p className="eyebrow">Venues</p>
        <h1>Map</h1>
        <p className="lede">
          {plan.selectedDate
            ? `Showing venues for ${formatDisplayDate(plan.selectedDate)}.`
            : 'Showing all active venues. Pick a day to narrow the pins.'}
        </p>
      </header>

      <PlanFilters plan={plan} showDateFilter showAllDaysOption />

      <div className="map-page-shell">
        <VenueMap
          sessions={plan.sessions}
          focusVenueId={plan.focusVenueId}
          selectedDate={plan.selectedDate}
        />
      </div>
    </div>
  )
}
