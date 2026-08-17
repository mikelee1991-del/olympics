import { interestedPeople, type PersonId } from './family'
import { resolveVenueId } from './venues'
import official from './officialSessions.json'

export type TicketStatus = 'have' | 'want' | 'skip'
export type SessionKind = 'MEDAL' | 'STD' | 'CEREMONY' | 'OTHER'

export type PlannedSession = {
  id: string
  sport: string
  venueLabel: string
  venueId: string
  /** ISO date YYYY-MM-DD (2028) */
  date: string
  /** HH:MM 24h Pacific */
  startTime: string
  endTime: string
  kind: SessionKind
  ticketStatus: TicketStatus
  attendees: PersonId[]
  notes: string
  /** true when start/end are guesses, not from LA28 PDF */
  timeEstimated: boolean
  /** Official LA28 session code when known (e.g. ATH01) */
  sessionCode?: string
}

export type OfficialSession = {
  code: string
  sport: string
  venue: string
  zone: string
  date: string
  startTime: string
  endTime: string
  sessionType: string
  description: string
}

export const OFFICIAL_META = {
  source: official.source,
  sourceUrl: official.sourceUrl,
  timezone: official.timezone,
}

export const OFFICIAL_SESSIONS = official.sessions as OfficialSession[]
export const OFFICIAL_SEED_CODES = new Set(official.seedCodes as string[])

export function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function kindFromOfficial(s: OfficialSession): SessionKind {
  if (s.sessionType === 'Ceremony' || s.sport === 'Ceremonies') return 'CEREMONY'
  if (
    s.sessionType === 'Final' ||
    /medal/i.test(s.description) ||
    s.sessionType === 'Semifinal'
  ) {
    return 'MEDAL'
  }
  return 'STD'
}

export function officialToPlanned(s: OfficialSession): PlannedSession {
  return {
    id: s.code.toLowerCase(),
    sport: s.sport,
    venueLabel: s.venue,
    venueId: resolveVenueId(s.venue),
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    kind: kindFromOfficial(s),
    ticketStatus: 'want',
    attendees: interestedPeople(s.sport),
    notes: `${s.sessionType}: ${s.description}`.trim(),
    timeEstimated: false,
    sessionCode: s.code,
  }
}

/** Seed wishlist from LA28 official By Event V4.0 sessions (family sports). */
export function buildSeedPlan(): PlannedSession[] {
  return OFFICIAL_SESSIONS.filter((s) => OFFICIAL_SEED_CODES.has(s.code))
    .map(officialToPlanned)
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )
}

export const ALL_SPORTS = [
  ...new Set(OFFICIAL_SESSIONS.map((s) => s.sport)),
].sort()

/** Bump key when seed source changes so browsers pick up official times. */
export const PLANNER_STORAGE_KEY = 'olympics-planner-v2-official'
