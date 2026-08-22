import { describe, expect, it } from 'vitest'
import { resolveVenueId } from '../data/venues'
import {
  buildSeedPlan,
  mergeFreeBoatSessions,
  mergeParalympicSessions,
  OFFICIAL_SESSIONS,
  OFFICIAL_SEED_CODES,
  PARALYMPIC_SEED_CODES,
  PARALYMPIC_SESSIONS,
  type PlannedSession,
} from './planner'

describe('official seed plan', () => {
  it('builds sessions from LA28 seed codes with clock times', () => {
    const plan = buildSeedPlan()
    expect(plan.length).toBeGreaterThanOrEqual(OFFICIAL_SEED_CODES.size)
    expect(plan.every((s) => !s.timeEstimated)).toBe(true)
    expect(plan.every((s) => /^\d{2}:\d{2}$/.test(s.startTime))).toBe(true)
    expect(plan[0].sessionCode).toBeTruthy()
    expect(plan.every((s) => s.access)).toBe(true)
    expect(
      plan.every((s) => s.games === 'olympic' || s.games === 'paralympic'),
    ).toBe(true)
  })

  it('includes Paralympic seed as want (no tickets yet)', () => {
    const plan = buildSeedPlan()
    const para = plan.filter((s) => s.games === 'paralympic')
    expect(para.length).toBe(PARALYMPIC_SEED_CODES.size)
    expect(para.every((s) => s.ticketStatus === 'want')).toBe(true)
    expect(para.every((s) => s.id.startsWith('para-'))).toBe(true)
    expect(para.some((s) => s.kind === 'CEREMONY')).toBe(true)
    expect(para.every((s) => s.date.startsWith('2028-08'))).toBe(true)
  })

  it('resolves seed venues to known map pins', () => {
    const seeded = OFFICIAL_SESSIONS.filter((s) =>
      OFFICIAL_SEED_CODES.has(s.code),
    )
    for (const s of seeded) {
      const id = resolveVenueId(s.venue)
      expect(id).not.toBe('')
      if (!/TBD/i.test(s.venue)) {
        expect(id).not.toBe('multiple')
      }
    }
  })

  it('merges free and boat sessions into an older saved plan', () => {
    const thin: PlannedSession[] = [
      {
        id: 'ath01',
        sport: 'Athletics',
        venueLabel: 'LA Memorial Coliseum',
        venueId: 'coliseum',
        date: '2028-07-15',
        startTime: '19:00',
        endTime: '22:00',
        kind: 'MEDAL',
        ticketStatus: 'want',
        attendees: ['Mike'],
        notes: 'old',
        timeEstimated: false,
        sessionCode: 'ATH01',
        access: 'ticketed',
        games: 'olympic',
      },
    ]
    const merged = mergeFreeBoatSessions(thin)
    expect(merged.some((s) => s.access === 'free')).toBe(true)
    expect(merged.some((s) => s.access === 'boat')).toBe(true)
    expect(merged.some((s) => s.sport === 'Cycling Road')).toBe(true)
    expect(merged.some((s) => s.sport === 'Sailing')).toBe(true)
    expect(merged.find((s) => s.id === 'ath01')).toBeTruthy()
  })

  it('merges Paralympic seed into an older Olympic-only plan', () => {
    const thin: PlannedSession[] = [
      {
        id: 'ath01',
        sport: 'Athletics',
        venueLabel: 'LA Memorial Coliseum',
        venueId: 'coliseum',
        date: '2028-07-15',
        startTime: '19:00',
        endTime: '22:00',
        kind: 'MEDAL',
        ticketStatus: 'want',
        attendees: ['Mike'],
        notes: 'old',
        timeEstimated: false,
        sessionCode: 'ATH01',
        access: 'ticketed',
        games: 'olympic',
      },
    ]
    const merged = mergeParalympicSessions(thin)
    expect(merged.some((s) => s.games === 'paralympic')).toBe(true)
    expect(merged.filter((s) => s.games === 'paralympic').length).toBe(
      PARALYMPIC_SEED_CODES.size,
    )
    expect(PARALYMPIC_SESSIONS.length).toBeGreaterThan(200)
  })
})
