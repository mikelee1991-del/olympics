import type { FormEvent } from 'react'
import { PEOPLE, type PersonId } from '../data/family'
import {
  ALL_SPORTS,
  formatDisplayDate,
  type AccessKind,
  type PlannedSession,
  type TicketStatus,
} from '../data/planner'
import { accessLabel } from '../data/access'
import { VENUES, resolveVenueId } from '../data/venues'

type Props = {
  initial?: PlannedSession | null
  onSave: (session: PlannedSession) => void
  onCancel: () => void
  onDelete?: (id: string) => void
}

function emptySession(): PlannedSession {
  return {
    id: `custom-${Date.now()}`,
    sport: 'Athletics',
    venueLabel: 'LA Memorial Coliseum',
    venueId: 'coliseum',
    date: '2028-07-15',
    startTime: '19:00',
    endTime: '22:00',
    kind: 'MEDAL',
    ticketStatus: 'want',
    attendees: ['Mike'],
    notes: '',
    timeEstimated: true,
    access: 'ticketed',
  }
}

export default function EventForm({
  initial,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const draft = initial ?? emptySession()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const sport = String(fd.get('sport'))
    const venueId = String(fd.get('venueId'))
    const venue = VENUES.find((v) => v.id === venueId)
    const attendees = PEOPLE.filter((p) => fd.get(`attendee-${p}`) === 'on')
    const session: PlannedSession = {
      id: draft.id,
      sport,
      venueId,
      venueLabel: venue?.name ?? String(fd.get('venueLabel') || sport),
      date: String(fd.get('date')),
      startTime: String(fd.get('startTime')),
      endTime: String(fd.get('endTime')),
      kind: String(fd.get('kind')) as PlannedSession['kind'],
      ticketStatus: String(fd.get('ticketStatus')) as TicketStatus,
      attendees,
      notes: String(fd.get('notes') || ''),
      timeEstimated: fd.get('timeEstimated') === 'on',
      access: String(fd.get('access') || 'ticketed') as AccessKind,
    }
    onSave(session)
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} data-testid="event-form">
      <header>
        <h2>{initial ? 'Edit session' : 'Add session'}</h2>
        <p>
          {initial
            ? `${initial.sport} · ${formatDisplayDate(initial.date)}`
            : 'Pick sport, time, tickets, and who is going.'}
        </p>
      </header>

      <div className="form-grid">
        <label>
          Sport
          <select name="sport" defaultValue={draft.sport} required>
            {ALL_SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Venue
          <select
            name="venueId"
            defaultValue={draft.venueId || resolveVenueId(draft.venueLabel)}
            required
          >
            {VENUES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.area})
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" name="date" defaultValue={draft.date} required />
        </label>
        <label>
          Kind
          <select name="kind" defaultValue={draft.kind}>
            <option value="MEDAL">Medal session</option>
            <option value="STD">Standard session</option>
            <option value="CEREMONY">Ceremony</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>
          Start
          <input
            type="time"
            name="startTime"
            defaultValue={draft.startTime}
            required
          />
        </label>
        <label>
          End
          <input
            type="time"
            name="endTime"
            defaultValue={draft.endTime}
            required
          />
        </label>
        <label>
          Tickets
          <select name="ticketStatus" defaultValue={draft.ticketStatus}>
            <option value="have">Have tickets</option>
            <option value="want">Want tickets</option>
            <option value="skip">Skip / not going</option>
          </select>
        </label>
        <label>
          Access
          <select name="access" defaultValue={draft.access ?? 'ticketed'}>
            <option value="ticketed">{accessLabel('ticketed')}</option>
            <option value="free">{accessLabel('free')}</option>
            <option value="boat">{accessLabel('boat')}</option>
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="timeEstimated"
            defaultChecked={draft.timeEstimated}
          />
          Time is estimated
        </label>
      </div>

      <fieldset>
        <legend>Who is going</legend>
        <div className="attendee-grid">
          {PEOPLE.map((p: PersonId) => (
            <label key={p} className="check">
              <input
                type="checkbox"
                name={`attendee-${p}`}
                defaultChecked={draft.attendees.includes(p)}
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Notes
        <textarea name="notes" rows={2} defaultValue={draft.notes} />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        {initial && onDelete ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(initial.id)}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  )
}
