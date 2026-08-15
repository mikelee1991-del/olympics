import { describe, expect, it } from 'vitest'
import {
  conflictsByPerson,
  findConflicts,
  sessionsOverlap,
} from '../lib/conflicts'
import type { PlannedSession } from '../data/planner'

function session(
  partial: Partial<PlannedSession> & Pick<PlannedSession, 'id' | 'date' | 'startTime' | 'endTime' | 'attendees'>,
): PlannedSession {
  return {
    sport: 'Athletics',
    venueLabel: 'LA Memorial Coliseum',
    venueId: 'coliseum',
    kind: 'MEDAL',
    ticketStatus: 'want',
    notes: '',
    timeEstimated: true,
    ...partial,
  }
}

describe('sessionsOverlap', () => {
  it('detects overlapping times on the same day', () => {
    const a = session({
      id: 'a',
      date: '2028-07-25',
      startTime: '19:00',
      endTime: '22:00',
      attendees: ['Mike'],
    })
    const b = session({
      id: 'b',
      sport: 'Swimming',
      venueId: 'stadium-2028',
      date: '2028-07-25',
      startTime: '20:00',
      endTime: '22:30',
      attendees: ['Mike'],
    })
    expect(sessionsOverlap(a, b)).toBe(true)
  })

  it('allows back-to-back sessions', () => {
    const a = session({
      id: 'a',
      date: '2028-07-25',
      startTime: '14:00',
      endTime: '17:00',
      attendees: ['Mike'],
    })
    const b = session({
      id: 'b',
      date: '2028-07-25',
      startTime: '17:00',
      endTime: '20:00',
      attendees: ['Mike'],
    })
    expect(sessionsOverlap(a, b)).toBe(false)
  })
})

describe('findConflicts', () => {
  it('reports per-person double books', () => {
    const sessions = [
      session({
        id: 'track',
        sport: 'Cycling Track',
        venueId: 'carson-velo',
        venueLabel: 'Carson Velodrome',
        date: '2028-07-25',
        startTime: '19:00',
        endTime: '22:00',
        attendees: ['Mike', 'Joy'],
      }),
      session({
        id: 'swim',
        sport: 'Swimming',
        venueId: 'stadium-2028',
        venueLabel: '2028 Stadium',
        date: '2028-07-25',
        startTime: '19:30',
        endTime: '22:00',
        attendees: ['Mike', 'Elle'],
      }),
    ]
    const conflicts = findConflicts(sessions)
    const byPerson = conflictsByPerson(conflicts)
    expect(byPerson.Mike?.some((c) => c.type === 'overlap')).toBe(true)
    expect(byPerson.Joy).toBeUndefined()
    expect(byPerson.Elle).toBeUndefined()
  })

  it('ignores skipped ticket sessions', () => {
    const sessions = [
      session({
        id: 'a',
        date: '2028-07-25',
        startTime: '19:00',
        endTime: '22:00',
        attendees: ['Mike'],
        ticketStatus: 'skip',
      }),
      session({
        id: 'b',
        date: '2028-07-25',
        startTime: '19:00',
        endTime: '22:00',
        attendees: ['Mike'],
        ticketStatus: 'want',
      }),
    ]
    expect(findConflicts(sessions)).toHaveLength(0)
  })
})
