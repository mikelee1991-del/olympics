import { interestedPeople, type PersonId } from './family'
import { resolveVenueId } from './venues'

export type TicketStatus = 'have' | 'want' | 'skip'
export type SessionKind = 'MEDAL' | 'STD' | 'CEREMONY' | 'OTHER'

export type PlannedSession = {
  id: string
  sport: string
  venueLabel: string
  venueId: string
  /** ISO date YYYY-MM-DD (2028) */
  date: string
  /** HH:MM 24h local */
  startTime: string
  endTime: string
  kind: SessionKind
  ticketStatus: TicketStatus
  attendees: PersonId[]
  notes: string
  /** true when start/end are editable guesses, not official times */
  timeEstimated: boolean
}

export type DayCell = 'MEDAL' | 'STD' | 'B' | 'R' | 'CEREMONY'

/** Compact schedule from Olympics_Scheduling.xlsx Schedule sheet. */
export const SPORT_CALENDAR: Array<{
  sport: string
  venue: string
  days: Partial<Record<string, DayCell>>
}> = [
  {
    sport: 'Archery',
    venue: 'Carson Stadium',
    days: {
      '20-Jul': 'MEDAL',
      '21-Jul': 'STD',
      '22-Jul': 'STD',
      '23-Jul': 'MEDAL',
      '24-Jul': 'MEDAL',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Artistic Gymnastics',
    venue: 'DTLA Arena',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'MEDAL',
      '17-Jul': 'MEDAL',
      '18-Jul': 'MEDAL',
      '19-Jul': 'MEDAL',
      '21-Jul': 'MEDAL',
      '22-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Athletics',
    venue: 'LA Memorial Coliseum / Venice Beach',
    days: {
      '14-Jul': 'MEDAL',
      '15-Jul': 'MEDAL',
      '16-Jul': 'MEDAL',
      '17-Jul': 'MEDAL',
      '18-Jul': 'MEDAL',
      '19-Jul': 'MEDAL',
      '20-Jul': 'MEDAL',
      '21-Jul': 'MEDAL',
      '23-Jul': 'MEDAL',
      '25-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Beach Volleyball',
    venue: 'Alamitos Beach Stadium',
    days: Object.fromEntries(
      [
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      ].map((d) => [`${d}-Jul`, 'STD']),
    ),
  },
  {
    sport: 'Canoe Sprint',
    venue: 'Marine Stadium',
    days: {
      '24-Jul': 'STD',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Ceremonies',
    venue: 'LA Memorial Coliseum',
    days: { '13-Jul': 'CEREMONY', '30-Jul': 'CEREMONY' },
  },
  {
    sport: 'Climbing',
    venue: 'Long Beach Climbing Theater',
    days: {
      '24-Jul': 'STD',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Cycling Track',
    venue: 'Carson Velodrome',
    days: {
      '24-Jul': 'MEDAL',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Diving',
    venue: 'Rose Bowl Aquatics Center',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'MEDAL',
      '17-Jul': 'STD',
      '18-Jul': 'MEDAL',
      '19-Jul': 'STD',
      '20-Jul': 'MEDAL',
      '21-Jul': 'MEDAL',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Equestrian',
    venue: 'Santa Anita Park',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'STD',
      '17-Jul': 'STD',
      '18-Jul': 'MEDAL',
      '19-Jul': 'STD',
      '20-Jul': 'MEDAL',
      '21-Jul': 'MEDAL',
      '23-Jul': 'STD',
      '24-Jul': 'MEDAL',
      '25-Jul': 'STD',
      '26-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Modern Pentathlon',
    venue: 'Valley Complex 2',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'STD',
      '17-Jul': 'MEDAL',
      '18-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Mountain Bike',
    venue: 'Industry Hill MTB Course',
    days: { '18-Jul': 'MEDAL', '19-Jul': 'MEDAL' },
  },
  {
    sport: 'Rowing',
    venue: 'Marine Stadium',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'STD',
      '17-Jul': 'MEDAL',
      '18-Jul': 'MEDAL',
      '19-Jul': 'MEDAL',
      '20-Jul': 'MEDAL',
      '21-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Rugby Sevens',
    venue: 'Carson Stadium',
    days: {
      '12-Jul': 'STD',
      '13-Jul': 'STD',
      '14-Jul': 'MEDAL',
      '15-Jul': 'STD',
      '16-Jul': 'STD',
      '17-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Swimming',
    venue: '2028 Stadium',
    days: {
      '22-Jul': 'MEDAL',
      '23-Jul': 'MEDAL',
      '24-Jul': 'MEDAL',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
      '29-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Table Tennis',
    venue: 'LA Convention Center Hall 3',
    days: {
      '15-Jul': 'STD',
      '16-Jul': 'STD',
      '17-Jul': 'MEDAL',
      '18-Jul': 'MEDAL',
      '19-Jul': 'MEDAL',
      '20-Jul': 'STD',
      '21-Jul': 'STD',
      '22-Jul': 'MEDAL',
      '23-Jul': 'MEDAL',
      '24-Jul': 'STD',
      '25-Jul': 'STD',
      '26-Jul': 'STD',
      '27-Jul': 'MEDAL',
      '28-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Tennis',
    venue: 'Carson Courts',
    days: {
      '18-Jul': 'STD',
      '19-Jul': 'MEDAL',
      '20-Jul': 'STD',
      '21-Jul': 'STD',
      '22-Jul': 'STD',
      '23-Jul': 'STD',
      '24-Jul': 'STD',
      '25-Jul': 'MEDAL',
      '26-Jul': 'MEDAL',
      '27-Jul': 'MEDAL',
    },
  },
  {
    sport: 'Volleyball',
    venue: 'Honda Center',
    days: Object.fromEntries(
      [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map((d) => [
        `${d}-Jul`,
        'STD',
      ]),
    ),
  },
  {
    sport: 'Water Polo',
    venue: 'Long Beach Aquatics Center',
    days: Object.fromEntries(
      [12, 13, 14, 15, 16, 17, 18, 19, 20].map((d) => [`${d}-Jul`, 'STD']),
    ),
  },
]

// Volleyball finals
SPORT_CALENDAR.find((s) => s.sport === 'Volleyball')!.days['28-Jul'] = 'MEDAL'
SPORT_CALENDAR.find((s) => s.sport === 'Volleyball')!.days['29-Jul'] = 'MEDAL'
SPORT_CALENDAR.find((s) => s.sport === 'Water Polo')!.days['21-Jul'] = 'MEDAL'
SPORT_CALENDAR.find((s) => s.sport === 'Water Polo')!.days['22-Jul'] = 'MEDAL'

const MONTH = 7
const YEAR = 2028

export function sheetDayToIso(day: string): string {
  const n = Number(day.replace('-Jul', ''))
  return `${YEAR}-${String(MONTH).padStart(2, '0')}-${String(n).padStart(2, '0')}`
}

export function isoToSheetDay(iso: string): string {
  const day = Number(iso.slice(8, 10))
  return `${day}-Jul`
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** Default session windows by kind — editable estimates only. */
function defaultTimes(
  sport: string,
  kind: SessionKind,
): { start: string; end: string } {
  if (kind === 'CEREMONY') {
    return sport.includes('Closing') || false
      ? { start: '19:00', end: '22:30' }
      : { start: '18:00', end: '22:00' }
  }
  // Evening finals bias for showcase sports
  const evening = new Set([
    'Athletics',
    'Swimming',
    'Artistic Gymnastics',
    'Diving',
    'Cycling Track',
    'Volleyball',
    'Rugby Sevens',
  ])
  if (evening.has(sport) || kind === 'MEDAL') {
    return { start: '19:00', end: '22:00' }
  }
  return { start: '14:00', end: '17:00' }
}

const SEED_SPORTS = new Set([
  'Ceremonies',
  'Athletics',
  'Swimming',
  'Cycling Track',
  'Rugby Sevens',
  'Volleyball',
  'Artistic Gymnastics',
  'Diving',
  'Table Tennis',
  'Canoe Sprint',
  'Modern Pentathlon',
  'Climbing',
  'Rowing',
  'Beach Volleyball',
  'Equestrian',
  'Tennis',
  'Mountain Bike',
  'Water Polo',
])

export function buildSeedPlan(): PlannedSession[] {
  const sessions: PlannedSession[] = []

  for (const row of SPORT_CALENDAR) {
    if (!SEED_SPORTS.has(row.sport)) continue
    for (const [day, cell] of Object.entries(row.days)) {
      if (!cell) continue
      // Seed ceremonies + medal days + a few key STD (beach VB, water polo finals week)
      const seedStd =
        (row.sport === 'Beach Volleyball' &&
          ['20-Jul', '22-Jul', '25-Jul'].includes(day)) ||
        (row.sport === 'Water Polo' && ['20-Jul', '21-Jul', '22-Jul'].includes(day))
      if (cell !== 'MEDAL' && cell !== 'CEREMONY' && !seedStd) continue

      const kind: SessionKind =
        cell === 'CEREMONY' ? 'CEREMONY' : cell === 'MEDAL' ? 'MEDAL' : 'STD'
      const times = defaultTimes(row.sport, kind)
      if (day === '30-Jul' && row.sport === 'Ceremonies') {
        times.start = '19:00'
        times.end = '22:30'
      }
      const attendees = interestedPeople(row.sport)
      const ticketStatus: TicketStatus =
        row.sport === 'Ceremonies' ||
        row.sport === 'Athletics' ||
        row.sport === 'Swimming'
          ? 'want'
          : attendees.length >= 4
            ? 'want'
            : 'want'

      sessions.push({
        id: `${row.sport}-${day}-${kind}`.replace(/\s+/g, '-').toLowerCase(),
        sport: row.sport,
        venueLabel: row.venue,
        venueId: resolveVenueId(row.venue),
        date: sheetDayToIso(day),
        startTime: times.start,
        endTime: times.end,
        kind,
        ticketStatus,
        attendees,
        notes:
          kind === 'CEREMONY'
            ? day === '13-Jul'
              ? 'Opening Ceremony — estimated evening start'
              : 'Closing Ceremony — estimated evening start'
            : 'Session time is an estimate — edit when tickets/session times are known.',
        timeEstimated: true,
      })
    }
  }

  return sessions.sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

export const ALL_SPORTS = [
  ...new Set(SPORT_CALENDAR.map((s) => s.sport)),
].sort()

export const PLANNER_STORAGE_KEY = 'olympics-planner-v1'
