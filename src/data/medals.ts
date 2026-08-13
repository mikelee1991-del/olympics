export type Sport =
  | 'Alpine Skiing'
  | 'Figure Skating'
  | 'Ice Hockey'
  | 'Snowboard'
  | 'Speed Skating'
  | 'Biathlon'

export type CountryStanding = {
  id: string
  country: string
  noc: string
  gold: number
  silver: number
  bronze: number
  highlightSport: Sport
}

export const STANDINGS: CountryStanding[] = [
  {
    id: 'nor',
    country: 'Norway',
    noc: 'NOR',
    gold: 16,
    silver: 8,
    bronze: 13,
    highlightSport: 'Biathlon',
  },
  {
    id: 'ger',
    country: 'Germany',
    noc: 'GER',
    gold: 12,
    silver: 10,
    bronze: 8,
    highlightSport: 'Alpine Skiing',
  },
  {
    id: 'usa',
    country: 'United States',
    noc: 'USA',
    gold: 11,
    silver: 12,
    bronze: 9,
    highlightSport: 'Snowboard',
  },
  {
    id: 'chn',
    country: 'China',
    noc: 'CHN',
    gold: 9,
    silver: 7,
    bronze: 6,
    highlightSport: 'Speed Skating',
  },
  {
    id: 'swe',
    country: 'Sweden',
    noc: 'SWE',
    gold: 8,
    silver: 6,
    bronze: 5,
    highlightSport: 'Ice Hockey',
  },
  {
    id: 'can',
    country: 'Canada',
    noc: 'CAN',
    gold: 7,
    silver: 9,
    bronze: 8,
    highlightSport: 'Ice Hockey',
  },
  {
    id: 'ned',
    country: 'Netherlands',
    noc: 'NED',
    gold: 7,
    silver: 5,
    bronze: 4,
    highlightSport: 'Speed Skating',
  },
  {
    id: 'ita',
    country: 'Italy',
    noc: 'ITA',
    gold: 6,
    silver: 8,
    bronze: 7,
    highlightSport: 'Alpine Skiing',
  },
  {
    id: 'fra',
    country: 'France',
    noc: 'FRA',
    gold: 5,
    silver: 7,
    bronze: 6,
    highlightSport: 'Alpine Skiing',
  },
  {
    id: 'jpn',
    country: 'Japan',
    noc: 'JPN',
    gold: 5,
    silver: 4,
    bronze: 8,
    highlightSport: 'Figure Skating',
  },
]

export function totalMedals(row: CountryStanding): number {
  return row.gold + row.silver + row.bronze
}

export function rankStandings(
  rows: CountryStanding[],
): Array<CountryStanding & { rank: number; total: number }> {
  const sorted = [...rows].sort((a, b) => {
    if (b.gold !== a.gold) return b.gold - a.gold
    if (b.silver !== a.silver) return b.silver - a.silver
    if (b.bronze !== a.bronze) return b.bronze - a.bronze
    return a.country.localeCompare(b.country)
  })

  return sorted.map((row, index) => ({
    ...row,
    rank: index + 1,
    total: totalMedals(row),
  }))
}

export const SPORTS: Sport[] = [
  'Alpine Skiing',
  'Figure Skating',
  'Ice Hockey',
  'Snowboard',
  'Speed Skating',
  'Biathlon',
]
