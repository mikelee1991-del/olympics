import { describe, expect, it } from 'vitest'
import {
  CONTINGENCY_MIN,
  PARK_ENTER_MIN,
  PARK_EXIT_MIN,
  travelBetweenVenues,
} from './travel'

describe('travelBetweenVenues', () => {
  it('uses a same-venue turnaround buffer', () => {
    const t = travelBetweenVenues('coliseum', 'coliseum')
    expect(t).not.toBeNull()
    expect(t!.driveMin).toBe(0)
    expect(t!.requiredGapMin).toBe(25)
  })

  it('adds park exit, drive, park enter, and contingency for hops', () => {
    const t = travelBetweenVenues('coliseum', 'carson-velo')
    expect(t).not.toBeNull()
    expect(t!.distanceKm).toBeGreaterThan(10)
    expect(t!.driveMin).toBeGreaterThan(20)
    expect(t!.requiredGapMin).toBe(
      PARK_EXIT_MIN + t!.driveMin + PARK_ENTER_MIN + CONTINGENCY_MIN,
    )
  })

  it('flags Long Beach → Carson as needing substantial buffer', () => {
    const t = travelBetweenVenues('lb-climb', 'carson-velo')
    expect(t!.requiredGapMin).toBeGreaterThan(60)
  })
})
