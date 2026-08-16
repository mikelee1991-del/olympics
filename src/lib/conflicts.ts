import type { PersonId } from '../data/family'
import type { PlannedSession } from '../data/planner'
import { VENUE_BY_ID } from '../data/venues'

export type Conflict = {
  person: PersonId
  a: PlannedSession
  b: PlannedSession
  type: 'overlap' | 'tight-travel'
  minutesBetween: number
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

function minutesBetween(a: PlannedSession, b: PlannedSession): number {
  if (a.date !== b.date) return Infinity
  const first = toMinutes(a.endTime) <= toMinutes(b.startTime) ? a : b
  const second = first === a ? b : a
  return toMinutes(second.startTime) - toMinutes(first.endTime)
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

/** Flag travel under 90 minutes when venues are > 15 km apart. */
const TIGHT_TRAVEL_MIN = 90
const FAR_KM = 15

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

      const gap = minutesBetween(a, b)
      if (gap < 0 || gap > TIGHT_TRAVEL_MIN) continue
      const va = VENUE_BY_ID[a.venueId]
      const vb = VENUE_BY_ID[b.venueId]
      if (!va || !vb) continue
      const dist = haversineKm(va.lat, va.lng, vb.lat, vb.lng)
      if (dist < FAR_KM) continue
      for (const person of shared) {
        conflicts.push({
          person,
          a,
          b,
          type: 'tight-travel',
          minutesBetween: gap,
        })
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
