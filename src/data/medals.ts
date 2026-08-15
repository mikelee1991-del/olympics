export type Sport =
  | 'Athletics'
  | 'Swimming'
  | 'Artistic Gymnastics'
  | 'Basketball'
  | 'Cycling Track'
  | 'Diving'

export type CountryStanding = {
  id: string
  country: string
  noc: string
  gold: number
  silver: number
  bronze: number
  highlightSport: Sport
}

/** Sample LA 2028 Summer Games medal table (demo data only). */
export const STANDINGS: CountryStanding[] = [
  {
    id: 'usa',
    country: 'United States',
    noc: 'USA',
    gold: 18,
    silver: 14,
    bronze: 12,
    highlightSport: 'Athletics',
  },
  {
    id: 'chn',
    country: 'China',
    noc: 'CHN',
    gold: 15,
    silver: 11,
    bronze: 9,
    highlightSport: 'Diving',
  },
  {
    id: 'aus',
    country: 'Australia',
    noc: 'AUS',
    gold: 12,
    silver: 10,
    bronze: 8,
    highlightSport: 'Swimming',
  },
  {
    id: 'gbr',
    country: 'Great Britain',
    noc: 'GBR',
    gold: 10,
    silver: 9,
    bronze: 7,
    highlightSport: 'Cycling Track',
  },
  {
    id: 'fra',
    country: 'France',
    noc: 'FRA',
    gold: 9,
    silver: 8,
    bronze: 10,
    highlightSport: 'Artistic Gymnastics',
  },
  {
    id: 'jpn',
    country: 'Japan',
    noc: 'JPN',
    gold: 8,
    silver: 7,
    bronze: 9,
    highlightSport: 'Artistic Gymnastics',
  },
  {
    id: 'ned',
    country: 'Netherlands',
    noc: 'NED',
    gold: 7,
    silver: 6,
    bronze: 5,
    highlightSport: 'Cycling Track',
  },
  {
    id: 'ita',
    country: 'Italy',
    noc: 'ITA',
    gold: 6,
    silver: 8,
    bronze: 7,
    highlightSport: 'Athletics',
  },
  {
    id: 'ger',
    country: 'Germany',
    noc: 'GER',
    gold: 5,
    silver: 7,
    bronze: 6,
    highlightSport: 'Swimming',
  },
  {
    id: 'can',
    country: 'Canada',
    noc: 'CAN',
    gold: 5,
    silver: 4,
    bronze: 8,
    highlightSport: 'Basketball',
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
  'Athletics',
  'Swimming',
  'Artistic Gymnastics',
  'Basketball',
  'Cycling Track',
  'Diving',
]
