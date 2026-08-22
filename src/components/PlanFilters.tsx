import { PEOPLE, type PersonId } from '../data/family'
import { accessLabel, type AccessKind } from '../data/access'
import { type TicketStatus } from '../data/planner'
import type { PlanState } from '../hooks/usePlan'

const TICKET_FILTERS: Array<TicketStatus | 'all'> = [
  'all',
  'have',
  'want',
  'skip',
]

const ACCESS_FILTERS: Array<AccessKind | 'all'> = [
  'all',
  'free',
  'ticketed',
]

type Props = {
  plan: PlanState
  showDateFilter?: boolean
  showAllDaysOption?: boolean
}

export default function PlanFilters({
  plan,
  showDateFilter = false,
  showAllDaysOption = false,
}: Props) {
  const dates = [...new Set(plan.sessions.map((s) => s.date))].sort()

  return (
    <div className="planner-toolbar">
      <div className="filters" role="group" aria-label="Ticket filter">
        {TICKET_FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            className={plan.ticketFilter === t ? 'chip active' : 'chip'}
            onClick={() => plan.setTicketFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="filters" role="group" aria-label="Access filter">
        {ACCESS_FILTERS.map((a) => (
          <button
            key={a}
            type="button"
            className={plan.accessFilter === a ? 'chip active' : 'chip'}
            onClick={() => plan.setAccessFilter(a)}
          >
            {a === 'all'
              ? 'all access'
              : a === 'free'
                ? 'free (incl. boat)'
                : accessLabel(a)}
          </button>
        ))}
      </div>
      <label className="inline">
        Person
        <select
          value={plan.personFilter}
          onChange={(e) =>
            plan.setPersonFilter(e.target.value as PersonId | 'all')
          }
        >
          <option value="all">Everyone</option>
          {PEOPLE.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      {showDateFilter ? (
        <label className="inline">
          Day
          <select
            value={plan.selectedDate ?? ''}
            onChange={(e) =>
              plan.setSelectedDate(e.target.value || null)
            }
          >
            {showAllDaysOption ? <option value="">All days</option> : null}
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}
