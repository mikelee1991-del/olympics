import { describe, expect, it } from 'vitest'
import { rankStandings, totalMedals, type CountryStanding } from '../data/medals'

const sample: CountryStanding[] = [
  {
    id: 'a',
    country: 'Alpha',
    noc: 'ALP',
    gold: 2,
    silver: 1,
    bronze: 0,
    highlightSport: 'Athletics',
  },
  {
    id: 'b',
    country: 'Beta',
    noc: 'BET',
    gold: 2,
    silver: 2,
    bronze: 0,
    highlightSport: 'Swimming',
  },
  {
    id: 'c',
    country: 'Gamma',
    noc: 'GAM',
    gold: 3,
    silver: 0,
    bronze: 0,
    highlightSport: 'Diving',
  },
]

describe('totalMedals', () => {
  it('sums gold silver and bronze', () => {
    expect(totalMedals(sample[0])).toBe(3)
  })
})

describe('rankStandings', () => {
  it('ranks by gold then silver then bronze', () => {
    const ranked = rankStandings(sample)
    expect(ranked.map((row) => row.id)).toEqual(['c', 'b', 'a'])
    expect(ranked[0].rank).toBe(1)
    expect(ranked[0].total).toBe(3)
  })
})
