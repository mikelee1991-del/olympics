import { describe, expect, it } from 'vitest'
import { resolveVenueId } from '../data/venues'
import { buildSeedPlan, OFFICIAL_SESSIONS, OFFICIAL_SEED_CODES } from '../data/planner'

describe('official seed plan', () => {
  it('builds sessions from LA28 seed codes with clock times', () => {
    const plan = buildSeedPlan()
    expect(plan.length).toBe(OFFICIAL_SEED_CODES.size)
    expect(plan.every((s) => !s.timeEstimated)).toBe(true)
    expect(plan.every((s) => /^\d{2}:\d{2}$/.test(s.startTime))).toBe(true)
    expect(plan[0].sessionCode).toBeTruthy()
  })

  it('resolves seed venues to known map pins', () => {
    const seeded = OFFICIAL_SESSIONS.filter((s) => OFFICIAL_SEED_CODES.has(s.code))
    for (const s of seeded) {
      const id = resolveVenueId(s.venue)
      expect(id).not.toBe('')
      // Race walk TBD may land on multiple; everything else should pin.
      if (!/TBD/i.test(s.venue)) {
        expect(id).not.toBe('multiple')
      }
    }
  })
})
