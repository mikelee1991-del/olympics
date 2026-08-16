import EventForm from './EventForm'
import type { PlanState } from '../hooks/usePlan'

export default function EditModal({ plan }: { plan: PlanState }) {
  if (!plan.editing) return null
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true">
        <EventForm
          initial={plan.editing === 'new' ? null : plan.editing}
          onSave={plan.upsert}
          onCancel={() => plan.setEditing(null)}
          onDelete={plan.editing === 'new' ? undefined : plan.remove}
        />
      </div>
    </div>
  )
}
