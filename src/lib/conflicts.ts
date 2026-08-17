import type { PersonId } from '../data/family'
import type { PlannedSession } from '../data/planner'
import { travelBetweenVenues, type TravelPlan } from './travel'

export type Conflict = {
  person: PersonId
  a: PlannedSession
  b: PlannedSession
  /** Hard time overlap vs not enough drive+park buffer */
  type: 'overlap' | 'cant-make-it'
  minutesBetween: number
  travel?: TravelPlan
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function sessionsOverlap(a: PlannedSession, b: PlannedSession): boolean {
  if (a.date !== b.date) return false
  const a0 = toMinutes(a.startTime)
  const a1 = toMinutes(a.endTime)
  const b0 = toMinutes(b.startTime)
  const b1 = toMinutes(b.endTime)
  return a0 < b1 && b0 < a1
}

/** Positive minutes from end of earlier session to start of later (same day). */
export function gapMinutes(a: PlannedSession, b: PlannedSession): number {
  if (a.date !== b.date) return Infinity
  const a0 = toMinutes(a.startTime)
  const b0 = toMinutes(b.startTime)
  const earlier = a0 <= b0 ? a : b
  const later = earlier === a ? b : a
  return toMinutes(later.startTime) - toMinutes(earlier.endTime)
}

export function findConflicts(
  sessions: PlannedSession[],
  opts: { includeSkip?: boolean } = {},
): Conflict[] {
  const active = sessions.filter(
    (s) => opts.includeSkip || s.ticketStatus !== 'skip',
  )
  const conflicts: Conflict[] = []

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i]
      const b = active[j]
      if (a.date !== b.date) continue

      const shared = a.attendees.filter((p) => b.attendees.includes(p))
      if (shared.length === 0) continue

      if (sessionsOverlap(a, b)) {
        for (const person of shared) {
          conflicts.push({
            person,
            a,
            b,
            type: 'overlap',
            minutesBetween: 0,
          })
        }
        continue
      }

      const gap = gapMinutes(a, b)
      if (gap === Infinity || gap < 0) continue

      const earlier =
        toMinutes(a.startTime) <= toMinutes(b.startTime) ? a : b
      const later = earlier === a ? b : a
      const travel = travelBetweenVenues(earlier.venueId, later.venueId)
      if (!travel) continue

      if (gap < travel.requiredGapMin) {
        for (const person of shared) {
          conflicts.push({
            person,
            a: earlier,
            b: later,
            type: 'cant-make-it',
            minutesBetween: gap,
            travel,
          })
        }
      }
    }
  }

  return conflicts
}

export function conflictsByPerson(
  conflicts: Conflict[],
): Record<string, Conflict[]> {
  const map: Record<string, Conflict[]> = {}
  for (const c of conflicts) {
    ;(map[c.person] ??= []).push(c)
  }
  return map
}
