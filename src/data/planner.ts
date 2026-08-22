import {
  accessNote,
  classifyAccess,
  freeOrBoatCodes,
  isFreeAccess,
  type AccessKind,
} from './access'
import { interestedPeople, type PersonId } from './family'
import {
  OWNED_TICKET_BY_CODE,
  OWNED_TICKETS,
  attendeesForOwnedTickets,
} from './ownedTickets'
import { resolveVenueId } from './venues'
import official from './officialSessions.json'
import paralympic from './paralympicSessions.json'

export type TicketStatus = 'have' | 'want' | 'skip'
export type SessionKind = 'MEDAL' | 'STD' | 'CEREMONY' | 'OTHER'
export type GamesKind = 'olympic' | 'paralympic'
export type { AccessKind }

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
  /** Ticketed vs course-free vs boat-viewable */
  access: AccessKind
  /** Purchased seat count when known */
  ticketQty?: number
  /** Olympic vs Paralympic */
  games: GamesKind
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

export const PARALYMPIC_META = {
  source: paralympic.source,
  sourceUrl: paralympic.sourceUrl,
  timezone: paralympic.timezone,
}

export const OFFICIAL_SESSIONS = official.sessions as OfficialSession[]
export const OFFICIAL_SEED_CODES = new Set(official.seedCodes as string[])
export const PARALYMPIC_SESSIONS = paralympic.sessions as OfficialSession[]
export const PARALYMPIC_SEED_CODES = new Set(paralympic.seedCodes as string[])

/** Map Para sports onto family Olympic interest lists when possible. */
export function sportInterestKey(sport: string): string {
  const map: Record<string, string> = {
    'Para Swimming': 'Swimming',
    'Para Athletics (Track & Field)': 'Athletics',
    'Para Athletics (Marathon)': 'Athletics',
    'Para Cycling Track': 'Cycling Track',
    'Para Cycling Road': 'Cycling Road',
    'Para Archery': 'Archery',
    'Para Badminton': 'Badminton',
    'Para Canoe': 'Canoe Sprint',
    'Para Climbing': 'Climbing',
    'Para Equestrian': 'Equestrian',
    'Para Rowing': 'Rowing',
    'Para Table Tennis': 'Table Tennis',
    'Para Triathlon': 'Triathlon',
    'Wheelchair Basketball': 'Basketball',
    'Wheelchair Tennis': 'Tennis',
    'Sitting Volleyball': 'Volleyball',
    Ceremonies: 'Ceremonies',
  }
  return map[sport] ?? sport
}

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
    s.sessionType === 'Bronze' ||
    /medal/i.test(s.description) ||
    s.sessionType === 'Semifinal'
  ) {
    return 'MEDAL'
  }
  return 'STD'
}

export function officialToPlanned(
  s: OfficialSession,
  games: GamesKind = 'olympic',
): PlannedSession {
  const access = classifyAccess(s)
  const note = accessNote(access)
  const owned = games === 'olympic' ? OWNED_TICKET_BY_CODE[s.code] : undefined
  const baseNotes = `${s.sessionType}: ${s.description}`.trim()
  const ownedNote = owned
    ? `Have ${owned.qty} ticket${owned.qty === 1 ? '' : 's'}${owned.label ? ` (${owned.label})` : ''}.`
    : games === 'paralympic'
      ? 'Paralympics placeholder — no tickets purchased yet.'
      : ''
  const interestSport = sportInterestKey(s.sport)
  const notes = [baseNotes, note, ownedNote].filter(Boolean).join(' — ')
  return {
    id: `${games === 'paralympic' ? 'para-' : ''}${s.code.toLowerCase()}`,
    sport: s.sport,
    venueLabel: s.venue,
    venueId: resolveVenueId(s.venue),
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    kind: kindFromOfficial(s),
    // Paralympics: placeholder only — no purchases yet (even free-course sports stay want).
    ticketStatus:
      games === 'paralympic'
        ? 'want'
        : owned || isFreeAccess(access)
          ? 'have'
          : 'want',
    attendees: owned
      ? attendeesForOwnedTickets(interestSport, owned.qty)
      : // Free / boat: opt-in — don't auto-assign (avoids fake ticket conflicts).
        access === 'free' || access === 'boat'
        ? []
        : interestedPeople(interestSport),
    notes,
    timeEstimated: false,
    sessionCode: s.code,
    access,
    ticketQty: owned?.qty,
    games,
  }
}

/** Family wishlist + free/boat + owned Olympic tickets + Paralympic medal seed. */
export function buildSeedPlan(): PlannedSession[] {
  const olympicCodes = new Set([
    ...OFFICIAL_SEED_CODES,
    ...freeOrBoatCodes(OFFICIAL_SESSIONS),
    ...OWNED_TICKETS.map((t) => t.code),
  ])
  const olympic = OFFICIAL_SESSIONS.filter((s) => olympicCodes.has(s.code)).map(
    (s) => officialToPlanned(s, 'olympic'),
  )
  const para = PARALYMPIC_SESSIONS.filter((s) =>
    PARALYMPIC_SEED_CODES.has(s.code),
  ).map((s) => officialToPlanned(s, 'paralympic'))
  return [...olympic, ...para].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

/** Backfill access / games on older saved plans; re-resolve venue from label. */
export function withAccess(session: PlannedSession): PlannedSession {
  const access =
    session.access ??
    classifyAccess({
      sport: session.sport,
      venue: session.venueLabel,
      description: session.notes,
    })
  const games =
    session.games ??
    (session.date.startsWith('2028-08') ? 'paralympic' : 'olympic')
  const venueId = resolveVenueId(session.venueLabel)
  return { ...session, access, games, venueId }
}

/**
 * Ensure free / boat-viewable official sessions exist in a saved plan and carry
 * the correct access tags (so older localStorage still shows them on Calendar).
 */
export function mergeFreeBoatSessions(
  sessions: PlannedSession[],
): PlannedSession[] {
  const byId = new Map(sessions.map((s) => [s.id, withAccess(s)] as const))

  for (const official of OFFICIAL_SESSIONS) {
    const access = classifyAccess(official)
    if (access === 'ticketed') continue
    const planned = officialToPlanned(official, 'olympic')
    const existing = byId.get(planned.id)
    if (!existing) {
      byId.set(planned.id, planned)
      continue
    }
    byId.set(planned.id, {
      ...existing,
      access,
      games: 'olympic',
      venueLabel: planned.venueLabel,
      venueId: planned.venueId,
      date: planned.date,
      startTime: planned.startTime,
      endTime: planned.endTime,
      kind: planned.kind,
      sessionCode: planned.sessionCode,
      timeEstimated: false,
      ticketStatus:
        isFreeAccess(access) && existing.ticketStatus !== 'skip'
          ? 'have'
          : existing.ticketStatus,
      notes: existing.notes.includes('LA28:') || existing.notes.includes('boat')
        ? existing.notes
        : planned.notes,
    })
  }

  return [...byId.values()].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

/** Force purchased tickets into the plan as have (with qty). */
export function mergeOwnedTickets(
  sessions: PlannedSession[],
): PlannedSession[] {
  const byId = new Map(sessions.map((s) => [s.id, withAccess(s)] as const))

  for (const owned of OWNED_TICKETS) {
    const official = OFFICIAL_SESSIONS.find((s) => s.code === owned.code)
    if (!official) continue
    const planned = officialToPlanned(official, 'olympic')
    const existing = byId.get(planned.id)
    if (!existing) {
      // First insert: seat by sport interest only (no padding).
      byId.set(planned.id, planned)
      continue
    }
    // Keep the user's attendees/notes — only force have + qty.
    byId.set(planned.id, {
      ...existing,
      ticketStatus: existing.ticketStatus === 'skip' ? 'skip' : 'have',
      ticketQty: owned.qty,
      access: planned.access,
      games: 'olympic',
      sessionCode: planned.sessionCode,
      venueLabel: planned.venueLabel,
      venueId: planned.venueId,
      date: planned.date,
      startTime: planned.startTime,
      endTime: planned.endTime,
      kind: planned.kind,
      timeEstimated: false,
      sport: planned.sport,
    })
  }

  return [...byId.values()].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

/** Ensure Paralympic seed sessions exist (want — no tickets yet). */
export function mergeParalympicSessions(
  sessions: PlannedSession[],
): PlannedSession[] {
  const byId = new Map(sessions.map((s) => [s.id, withAccess(s)] as const))
  for (const official of PARALYMPIC_SESSIONS) {
    if (!PARALYMPIC_SEED_CODES.has(official.code)) continue
    const planned = officialToPlanned(official, 'paralympic')
    if (!byId.has(planned.id)) byId.set(planned.id, planned)
  }
  return [...byId.values()].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

/** Apply free/boat + owned + paralympic merges for saved plans. */
export function hydratePlan(sessions: PlannedSession[]): PlannedSession[] {
  return mergeParalympicSessions(
    mergeOwnedTickets(mergeFreeBoatSessions(sessions)),
  )
}

export const ALL_SPORTS = [
  ...new Set([
    ...OFFICIAL_SESSIONS.map((s) => s.sport),
    ...PARALYMPIC_SESSIONS.map((s) => s.sport),
  ]),
].sort()

/** Bump key when owned-ticket seating / free opt-in changes. */
export const PLANNER_STORAGE_KEY = 'olympics-planner-v6-alloc'

/** Clear every planner key (current + legacy) before a hard reset. */
export function clearPlannerStorage(): void {
  const doomed = new Set<string>([
    PLANNER_STORAGE_KEY,
    'olympics-planner-v1',
    'olympics-planner-v2-official',
    'olympics-planner-v3-access',
    'olympics-planner-v4-owned',
    'olympics-planner-v5-para',
  ])
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('olympics-planner-')) doomed.add(key)
  }
  for (const key of doomed) localStorage.removeItem(key)
}
