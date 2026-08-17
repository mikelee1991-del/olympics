import { useMemo, useState } from 'react'
import { type PersonId } from '../data/family'
import {
  buildSeedPlan,
  PLANNER_STORAGE_KEY,
  withAccess,
  type AccessKind,
  type PlannedSession,
  type TicketStatus,
} from '../data/planner'
import { conflictsByPerson, findConflicts } from '../lib/conflicts'

function loadPlan(): PlannedSession[] {
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY)
    if (!raw) return buildSeedPlan()
    const parsed = JSON.parse(raw) as PlannedSession[]
    if (!Array.isArray(parsed) || parsed.length === 0) return buildSeedPlan()
    return parsed.map(withAccess)
  } catch {
    return buildSeedPlan()
  }
}

function savePlan(sessions: PlannedSession[]) {
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(sessions))
}

export function usePlan() {
  const [sessions, setSessions] = useState<PlannedSession[]>(loadPlan)
  const [selectedDate, setSelectedDate] = useState<string | null>('2028-07-14')
  const [ticketFilter, setTicketFilter] = useState<TicketStatus | 'all'>('all')
  const [accessFilter, setAccessFilter] = useState<AccessKind | 'all'>('all')
  const [personFilter, setPersonFilter] = useState<PersonId | 'all'>('all')
  const [editing, setEditing] = useState<PlannedSession | null | 'new'>(null)
  const [focusVenueId, setFocusVenueId] = useState<string | null>(null)

  const conflicts = useMemo(() => findConflicts(sessions), [sessions])
  const byPerson = useMemo(() => conflictsByPerson(conflicts), [conflicts])

  const counts = useMemo(() => {
    const have = sessions.filter((s) => s.ticketStatus === 'have').length
    const want = sessions.filter((s) => s.ticketStatus === 'want').length
    const skip = sessions.filter((s) => s.ticketStatus === 'skip').length
    const free = sessions.filter((s) => s.access === 'free').length
    const boat = sessions.filter((s) => s.access === 'boat').length
    const overlaps = conflicts.filter((c) => c.type === 'overlap').length
    const cantMakeIt = conflicts.filter((c) => c.type === 'cant-make-it').length
    return { have, want, skip, free, boat, overlaps, cantMakeIt }
  }, [sessions, conflicts])

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => (selectedDate ? s.date === selectedDate : true))
      .filter((s) =>
        ticketFilter === 'all' ? true : s.ticketStatus === ticketFilter,
      )
      .filter((s) =>
        accessFilter === 'all' ? true : s.access === accessFilter,
      )
      .filter((s) =>
        personFilter === 'all' ? true : s.attendees.includes(personFilter),
      )
      .sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      )
  }, [sessions, selectedDate, ticketFilter, accessFilter, personFilter])

  function updateSessions(next: PlannedSession[]) {
    setSessions(next)
    savePlan(next)
  }

  function upsert(session: PlannedSession) {
    const exists = sessions.some((s) => s.id === session.id)
    updateSessions(
      exists
        ? sessions.map((s) => (s.id === session.id ? session : s))
        : [...sessions, session],
    )
    setEditing(null)
    setSelectedDate(session.date)
    setFocusVenueId(session.venueId)
  }

  function remove(id: string) {
    updateSessions(sessions.filter((s) => s.id !== id))
    setEditing(null)
  }

  function setTicket(id: string, ticketStatus: TicketStatus) {
    updateSessions(
      sessions.map((s) => (s.id === id ? { ...s, ticketStatus } : s)),
    )
  }

  function togglePerson(id: string, person: PersonId) {
    updateSessions(
      sessions.map((s) => {
        if (s.id !== id) return s
        const has = s.attendees.includes(person)
        return {
          ...s,
          attendees: has
            ? s.attendees.filter((p) => p !== person)
            : [...s.attendees, person],
        }
      }),
    )
  }

  function resetSeed() {
    if (
      !window.confirm(
        'Reset plan to official LA28 seed times for the family wishlist?',
      )
    )
      return
    updateSessions(buildSeedPlan())
    setSelectedDate('2028-07-14')
    setEditing(null)
  }

  return {
    sessions,
    filtered,
    selectedDate,
    setSelectedDate,
    ticketFilter,
    setTicketFilter,
    accessFilter,
    setAccessFilter,
    personFilter,
    setPersonFilter,
    editing,
    setEditing,
    focusVenueId,
    setFocusVenueId,
    conflicts,
    byPerson,
    counts,
    upsert,
    remove,
    setTicket,
    togglePerson,
    resetSeed,
  }
}

export type PlanState = ReturnType<typeof usePlan>
