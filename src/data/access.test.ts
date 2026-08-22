import { describe, expect, it } from 'vitest'
import { classifyAccess, freeOrBoatCodes } from './access'
import {
  buildSeedPlan,
  OFFICIAL_SESSIONS,
  OFFICIAL_SEED_CODES,
} from './planner'

describe('classifyAccess', () => {
  it('marks LA28 non-ticketed course events as free', () => {
    expect(
      classifyAccess({
        sport: 'Cycling Road',
        venue: '(Road Race) Venice Beach Boardwalk',
      }),
    ).toBe('free')
    expect(
      classifyAccess({
        sport: 'Athletics',
        venue: '(Marathon) Venice Beach Boardwalk - Start Venice',
        description: "Women's Marathon",
      }),
    ).toBe('free')
    expect(
      classifyAccess({
        sport: 'Athletics',
        venue: '(Race Walk) TBD TBD',
        description: 'Half-Marathon Race Walk',
      }),
    ).toBe('free')
  })

  it('marks open-water sports as boat-viewable', () => {
    expect(
      classifyAccess({
        sport: 'Sailing',
        venue: '(Dinghy, Skiff & Multihull) Port of Los Angeles',
      }),
    ).toBe('boat')
    expect(
      classifyAccess({ sport: 'Open Water Swimming', venue: 'Belmont Shore' }),
    ).toBe('boat')
    expect(
      classifyAccess({
        sport: 'Surfing',
        venue: 'Trestles State Beach Trestles Beach',
      }),
    ).toBe('boat')
    expect(
      classifyAccess({
        sport: 'Rowing Coastal Beach Sprints',
        venue: 'Belmont Shore',
      }),
    ).toBe('boat')
  })

  it('leaves arena sports ticketed', () => {
    expect(
      classifyAccess({ sport: 'Swimming', venue: '2028 Stadium' }),
    ).toBe('ticketed')
  })
})

describe('official seed plan access', () => {
  it('includes free and boat sessions and tags them', () => {
    const plan = buildSeedPlan()
    const olympicFree = plan.filter(
      (s) => s.access === 'free' && s.games === 'olympic',
    )
    const boat = plan.filter((s) => s.access === 'boat' && s.games === 'olympic')
    expect(olympicFree.length).toBeGreaterThanOrEqual(6) // 3 marathon/walk + 3 road
    expect(boat.length).toBeGreaterThanOrEqual(10) // sailing + OWS + surfing + coastal
    expect(olympicFree.every((s) => s.ticketStatus === 'have')).toBe(true)
    expect(plan.some((s) => s.sport === 'Cycling Road')).toBe(true)
    expect(plan.some((s) => s.sport === 'Sailing')).toBe(true)
  })

  it('keeps family seed codes plus free/boat codes', () => {
    const plan = buildSeedPlan()
    const codes = new Set(plan.map((s) => s.sessionCode))
    for (const code of OFFICIAL_SEED_CODES) {
      expect(codes.has(code)).toBe(true)
    }
    for (const code of freeOrBoatCodes(OFFICIAL_SESSIONS)) {
      expect(codes.has(code)).toBe(true)
    }
  })
})
