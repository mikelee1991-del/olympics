import { describe, expect, it } from 'vitest'
import { attendeesForOwnedTickets, OWNED_TICKETS } from './ownedTickets'
import { buildSeedPlan, hydratePlan, type PlannedSession } from './planner'

describe('owned tickets', () => {
  it('seeds purchased sessions as have with ticket qty', () => {
    const plan = buildSeedPlan()
    for (const owned of OWNED_TICKETS) {
      const s = plan.find((p) => p.sessionCode === owned.code)
      expect(s, owned.code).toBeTruthy()
      expect(s!.ticketStatus).toBe('have')
      expect(s!.ticketQty).toBe(owned.qty)
      expect(s!.attendees).toHaveLength(owned.qty)
    }
  })

  it('picks interested attendees up to seat count', () => {
    const canoe = attendeesForOwnedTickets('Canoe Sprint', 5)
    expect(canoe).toHaveLength(5)
    expect(canoe).toContain('Mike')
  })

  it('merges owned tickets into an older saved plan', () => {
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
    const merged = hydratePlan(thin)
    expect(merged.find((s) => s.sessionCode === 'ARC10')?.ticketStatus).toBe(
      'have',
    )
    expect(merged.find((s) => s.sessionCode === 'HBL42')?.ticketQty).toBe(3)
    expect(merged.find((s) => s.sessionCode === 'CSP04')?.ticketQty).toBe(5)
  })
})
